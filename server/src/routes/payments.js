const express = require("express");
const crypto = require("crypto");
const { getDb } = require("../db");
const { bookingSchema } = require("../utils/validation");

const router = express.Router();

const toAmount = (value) => Number.parseFloat(value).toFixed(2);

const md5 = (value) =>
  crypto.createHash("md5").update(value).digest("hex").toUpperCase();

const buildPayHereHash = ({ merchantId, orderId, amount, currency, secret }) =>
  md5(merchantId + orderId + amount + currency + md5(secret));

const buildNotifyHash = ({
  merchantId,
  orderId,
  amount,
  currency,
  statusCode,
  secret,
}) => md5(merchantId + orderId + amount + currency + statusCode + md5(secret));

const splitName = (fullName) => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "-" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
};

router.post("/payhere/checkout", async (req, res) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid booking payload" });
  }

  const merchantId = process.env.PAYHERE_MERCHANT_ID;
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  const currency = process.env.PAYHERE_CURRENCY || "LKR";
  const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const depositPercent = Number(process.env.PAYHERE_DEPOSIT_PERCENT || 0.2);
  const checkoutUrl =
    process.env.PAYHERE_CHECKOUT_URL || "https://www.payhere.lk/pay/checkout";

  if (!merchantId || !merchantSecret) {
    return res.status(500).json({ message: "PayHere not configured" });
  }

  const {
    type,
    refId,
    fullName,
    email,
    phone,
    address,
    city,
    country,
    travelDates,
    guests,
    message,
  } = parsed.data;

  if (!address || !city || !country) {
    return res.status(400).json({
      message: "Address, city, and country are required for payments.",
    });
  }

  const db = await getDb();

  if (type !== "stay") {
    return res.status(400).json({ message: "Payment only for stays right now" });
  }

  const stay = await db.get("SELECT * FROM stays WHERE id = ?", [refId]);
  if (!stay) {
    return res.status(404).json({ message: "Stay not found" });
  }

  const baseAmount = Number(stay.price || 0);
  const amountValue = baseAmount * depositPercent;
  const amount = toAmount(amountValue);

  const orderId = `STAY-${refId}-${Date.now()}`;
  const items = `Stay deposit: ${stay.name}`;
  const { firstName, lastName } = splitName(fullName);

  const bookingResult = await db.run(
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

  await db.run(
    "INSERT INTO payments (booking_id, order_id, provider, amount, currency, status) VALUES (?, ?, ?, ?, ?, ?)",
    [
      bookingResult.lastID,
      orderId,
      "payhere",
      Number(amount),
      currency,
      "initiated",
    ]
  );

  const hash = buildPayHereHash({
    merchantId,
    orderId,
    amount,
    currency,
    secret: merchantSecret,
  });

  return res.json({
    action: checkoutUrl,
    fields: {
      merchant_id: merchantId,
      return_url: `${frontendUrl}/stays/${refId}?payment=success`,
      cancel_url: `${frontendUrl}/stays/${refId}?payment=cancel`,
      notify_url: `${backendUrl}/api/payments/payhere/notify`,
      order_id: orderId,
      items,
      currency,
      amount,
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || "",
      address,
      city,
      country,
      hash,
      custom_1: bookingResult.lastID,
      custom_2: refId,
    },
  });
});

router.post(
  "/payhere/notify",
  express.urlencoded({ extended: false }),
  async (req, res) => {
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    if (!merchantId || !merchantSecret) {
      return res.status(500).send("PayHere not configured");
    }

    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      payment_id,
      method,
    } = req.body || {};

    if (!merchant_id || !order_id) {
      return res.status(400).send("Missing fields");
    }

    const expected = buildNotifyHash({
      merchantId,
      orderId: order_id,
      amount: toAmount(payhere_amount),
      currency: payhere_currency,
      statusCode: String(status_code),
      secret: merchantSecret,
    });

    if (expected !== String(md5sig).toUpperCase()) {
      return res.status(400).send("Invalid signature");
    }

    const db = await getDb();
    const status =
      String(status_code) === "2" ? "paid" : `status_${status_code}`;

    await db.run(
      "UPDATE payments SET status = ?, payment_id = ?, method = ?, raw_json = ?, updated_at = datetime('now') WHERE order_id = ?",
      [
        status,
        payment_id || null,
        method || null,
        JSON.stringify(req.body || {}),
        order_id,
      ]
    );

    return res.send("OK");
  }
);

module.exports = router;
