const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const db = require("../config/db");

router.post(
  "/webhook",
  express.raw({ type: "*/*" }), // 🔥 MUST be raw
  async (req, res) => {
    try {
      console.log("🔥 WEBHOOK HIT");
      console.log("Body type:", Buffer.isBuffer(req.body));

      const signature = req.headers["x-razorpay-signature"];

      // 🔐 Razorpay validates using HMAC-SHA256 internally
      Razorpay.validateWebhookSignature(
        req.body,
        signature,
        process.env.RAZORPAY_WEBHOOK_SECRET
      );

      console.log("✅ Signature verified by Razorpay SDK");

      const event = JSON.parse(req.body.toString());

      if (event.event === "payment.captured") {
        console.log("💰 Payment captured event received");

        const payment = event.payload.payment.entity;

        await db.query("BEGIN");

        const orderRes = await db.query(
          "SELECT * FROM orders WHERE razorpay_order_id=$1",
          [payment.order_id]
        );

        if (!orderRes.rowCount) {
          await db.query("ROLLBACK");
          return res.json({ status: "order_not_found" });
        }

        const order = orderRes.rows[0];

        await db.query(
          `INSERT INTO payments (order_id, razorpay_payment_id, status)
           VALUES ($1,$2,'success')
           ON CONFLICT DO NOTHING`,
          [order.id, payment.id]
        );

        await db.query(
          `INSERT INTO enrollments (user_id, training_id)
           VALUES ($1,$2)
           ON CONFLICT DO NOTHING`,
          [order.user_id, order.training_id]
        );

        if (order.coupon_code === "FIRST10") {
          await db.query(
            `UPDATE coupons
             SET used_count = used_count + 1
             WHERE code='FIRST10' AND used_count < max_users`
          );
        }

        await db.query(
          "UPDATE orders SET status='paid' WHERE id=$1",
          [order.id]
        );

        await db.query("COMMIT");
      }

      res.json({ status: "ok" });

    } catch (err) {
      console.error("❌ Webhook verification failed:", err.message);
      return res.status(400).send("Invalid signature");
    }
  }
);

module.exports = router;