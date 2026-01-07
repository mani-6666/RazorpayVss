const express = require('express');
require("dotenv").config();
const cors = require('cors')
const checkoutRoutes = require("./routes/checkout.js");
const webhookRoutes = require("./routes/webhook.js");
const trainingsRoutes = require('./routes/trainings.js')
const app = express();

app.use(cors())

app.use(
  "/api/razorpay",
  webhookRoutes
);
app.use(express.json())

app.use("/api/trainings", trainingsRoutes);
app.use("/api", checkoutRoutes);



const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("SERVER STARTED ON PORT", PORT);
});