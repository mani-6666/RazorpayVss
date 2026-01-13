import axios from "axios";

const API_BASE = "https://razorpay-backend-931100197216.asia-south1.run.app/api";

// CREATE AXIOS INSTANCE (BEST PRACTICE)
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json"
  }
});

/* =========================
   TRAININGS
========================= */
export async function getTrainings() {
  const res = await api.get("/trainings");
  return res.data; // ✅ IMPORTANT
}

/* =========================
   COUPON VALIDATION
========================= */
export async function validateCoupon(payload) {
  try {
    const res = await api.post("/coupons/validate", payload);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Invalid or expired coupon"
    );
  }
}

/* =========================
   CHECKOUT
========================= */
export async function checkout(payload) {
  const res = await api.post("/checkout", payload);
  return res.data;
}
