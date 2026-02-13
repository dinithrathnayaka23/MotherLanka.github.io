const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDb } = require("../db");
const {
  buildAccessToken,
  buildRefreshToken,
  requireAuth,
  requireAdmin,
} = require("../middleware/auth");
const { loginSchema, registerSchema, refreshSchema } = require("../utils/validation");

const router = express.Router();

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid login payload" });
  }

  const { email, password } = parsed.data;
  const db = await getDb();
  const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = buildAccessToken(user);
  const refresh = buildRefreshToken(user);
  await db.run(
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
    [user.id, refresh.token, refresh.expiresAt.toISOString()]
  );

  return res.json({
    accessToken,
    refreshToken: refresh.token,
    user: { id: user.id, email: user.email, role: user.role },
  });
});

router.post("/refresh", async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid refresh payload" });
  }

  const { refreshToken } = parsed.data;
  let payload;

  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, {
      issuer: process.env.TOKEN_ISSUER || "motherlanka",
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  const db = await getDb();
  const stored = await db.get(
    "SELECT * FROM refresh_tokens WHERE token = ?",
    [refreshToken]
  );
  if (!stored) {
    return res.status(401).json({ message: "Refresh token not recognized" });
  }

  const user = await db.get("SELECT * FROM users WHERE id = ?", [payload.sub]);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const accessToken = buildAccessToken(user);
  return res.json({ accessToken });
});

router.post("/logout", async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid refresh payload" });
  }

  const db = await getDb();
  await db.run("DELETE FROM refresh_tokens WHERE token = ?", [
    parsed.data.refreshToken,
  ]);
  return res.json({ ok: true });
});

router.get("/me", requireAuth, async (req, res) => {
  const db = await getDb();
  const user = await db.get("SELECT id, email, role FROM users WHERE id = ?", [
    req.user.sub,
  ]);
  return res.json({ user });
});

router.post("/register", requireAuth, requireAdmin, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid register payload" });
  }

  const { email, password, role } = parsed.data;
  const db = await getDb();
  const exists = await db.get("SELECT id FROM users WHERE email = ?", [email]);
  if (exists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);
  await db.run(
    "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)",
    [email, hash, role || "admin"]
  );

  return res.status(201).json({ message: "User created" });
});

module.exports = router;
