const express = require("express");
const { getDb } = require("../db");
const { newsletterSchema } = require("../utils/validation");

const router = express.Router();

router.post("/", async (req, res) => {
  const parsed = newsletterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const db = await getDb();
  try {
    await db.run("INSERT INTO newsletter_subscribers (email) VALUES (?)", [
      parsed.data.email,
    ]);
  } catch (err) {
    return res.json({ ok: true, message: "Already subscribed" });
  }

  return res.json({ ok: true });
});

module.exports = router;
