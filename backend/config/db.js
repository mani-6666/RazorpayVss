const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on("connect", () => {
  console.log("PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("Postgres error", err);
  process.exit(1);
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
