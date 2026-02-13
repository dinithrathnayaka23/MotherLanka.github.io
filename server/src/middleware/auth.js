const jwt = require("jsonwebtoken");

const ACCESS_TTL = "15m";
const REFRESH_TTL_DAYS = 7;

const buildAccessToken = (user) =>
  jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TTL, issuer: process.env.TOKEN_ISSUER || "motherlanka" }
  );

const buildRefreshToken = (user) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TTL_DAYS);
  const token = jwt.sign(
    { sub: user.id, email: user.email, type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: `${REFRESH_TTL_DAYS}d`,
      issuer: process.env.TOKEN_ISSUER || "motherlanka",
    }
  );

  return { token, expiresAt };
};

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing access token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.TOKEN_ISSUER || "motherlanka",
    });
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  return next();
};

module.exports = {
  ACCESS_TTL,
  REFRESH_TTL_DAYS,
  buildAccessToken,
  buildRefreshToken,
  requireAuth,
  requireAdmin,
};
