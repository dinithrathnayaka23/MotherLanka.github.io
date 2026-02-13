require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getDb } = require("./db");

const authRoutes = require("./routes/auth");
const contentRoutes = require("./routes/content");
const contactRoutes = require("./routes/contact");
const newsletterRoutes = require("./routes/newsletter");
const bookingRoutes = require("./routes/bookings");
const chatRoutes = require("./routes/chat");
const ragRoutes = require("./routes/rag");
const paymentRoutes = require("./routes/payments");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api", contentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/rag", ragRoutes);
app.use("/api/payments", paymentRoutes);

const port = process.env.PORT || 5000;

getDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`API running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
  });
