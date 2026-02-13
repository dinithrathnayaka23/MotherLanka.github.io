const express = require("express");
const { getDb } = require("../db");
const { bookingSchema } = require("../utils/validation");

const router = express.Router();

router.post("/", async (req, res) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid booking payload" });
  }

  const {
    type,
    refId,
    fullName,
    email,
    phone,
    travelDates,
    guests,
    message,
  } = parsed.data;

  const db = await getDb();
  await db.run(
    "INSERT INTO bookings (type, ref_id, full_name, email, phone, travel_dates, guests, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      type,
      refId,
      fullName,
      email,
      phone || null,
      travelDates || null,
      guests || null,
      message || null,
    ]
  );

  return res.json({ ok: true });
});

module.exports = router;
