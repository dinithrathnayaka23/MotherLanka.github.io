const express = require("express");
const { getDb } = require("../db");
const { contactSchema } = require("../utils/validation");

const router = express.Router();

router.post("/", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid contact payload" });
  }

  const { name, email, travelDates, interests, message } = parsed.data;
  const db = await getDb();
  await db.run(
    "INSERT INTO contact_messages (name, email, travel_dates, interests, message) VALUES (?, ?, ?, ?, ?)",
    [name, email, travelDates || null, interests || null, message]
  );

  return res.json({ ok: true });
});

module.exports = router;
