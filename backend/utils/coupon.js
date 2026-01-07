const db = require("../config/db.js");

async function applyFirst10Coupon(price) {
  const res = await db.query(
    "SELECT * FROM coupons WHERE code='FIRST10' AND is_active=true"
  );

  if (!res.rowCount) return { discount: 0 };

  const coupon = res.rows[0];

  if (coupon.used_count >= coupon.max_users) {
    return { discount: 0 };
  }

  const discount = Math.floor((price * coupon.discount_percentage) / 100);
  return { discount };
}

module.exports = { applyFirst10Coupon };
