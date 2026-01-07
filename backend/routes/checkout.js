const express = require("express");
const router = express.Router();
const db = require("../config/db");
const razorpay = require("../config/razorpay");
const { applyFirst10Coupon } = require("../utils/coupon");

router.post("/checkout", async (req, res) => {
  const {
    trainingId,
    couponCode,
    firstName,
    lastName,
    email,
    phone,
    street,
    city,
    state,
    zipCode,
    country
  } = req.body;

  try {
    await db.query("BEGIN");

    // 1️⃣ Create / Update User
    const userRes = await db.query(
      `INSERT INTO users
       (first_name,last_name,email,phone,street,city,state,zip_code,country)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (email)
       DO UPDATE SET phone=EXCLUDED.phone
       RETURNING id`,
      [firstName, lastName, email, phone, street, city, state, zipCode, country]
    );

    const userId = userRes.rows[0].id;

    // 2️⃣ Get Training Price
    const trainingRes = await db.query(
      "SELECT price_amount FROM trainings WHERE id=$1",
      [trainingId]
    );

    if (!trainingRes.rowCount) {
      throw new Error("Training not found");
    }

    const price = trainingRes.rows[0].price_amount;

    // 3️⃣ Apply Coupon
    let discount = 0;
    if (couponCode === "FIRST10") {
      const result = await applyFirst10Coupon(price);
      discount = result.discount;
    }

    const finalAmount = price - discount;

    // 4️⃣ Create Razorpay Order
    const rpOrder = await razorpay.orders.create({
      amount: finalAmount,
      currency: "INR"
    });

    // 5️⃣ Save Order
    await db.query(
      `INSERT INTO orders
       (user_id, training_id, razorpay_order_id, amount, discount_amount, final_amount, coupon_code)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [userId, trainingId, rpOrder.id, price, discount, finalAmount, couponCode]
    );

    await db.query("COMMIT");

    res.json({
      order_id: rpOrder.id,
      amount: finalAmount,
      razorpay_key: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    await db.query("ROLLBACK");
    res.status(400).json({ error: err.message });
  }
});

router.post("/coupons/validate", async (req, res) => {
  const { couponCode, trainingId } = req.body;

  const coupon = await db.query(
    `SELECT * FROM coupons 
     WHERE code = $1 
       AND is_active = true
       AND (expires_at IS NULL OR expires_at > now())`,
    [couponCode]
  );
  console.log(coupon)

  if (!coupon.rowCount) {
    return res.status(400).json({ message: "Invalid or expired coupon" });
  }

  if (coupon.rows[0].used_count >= coupon.rows[0].max_uses) {
    return res.status(400).json({ message: "Coupon usage limit exceeded" });
  }

  res.json({
    valid: true,
    discount_percent: coupon.rows[0].discount_percentage
  });
});

module.exports = router;
