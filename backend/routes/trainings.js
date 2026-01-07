const express = require( "express");
const pool = require( "../config/db.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, price_amount FROM trainings`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch trainings" });
  }
});

module.exports = router;
