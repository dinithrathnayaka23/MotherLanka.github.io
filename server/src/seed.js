require("dotenv").config();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { getDb } = require("./db");

const seedDir = path.join(__dirname, "..", "data", "seed");

const loadJson = (name) => {
  const filePath = path.join(seedDir, name);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

async function ensureAdmin(db) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  const existing = await db.get("SELECT id FROM users WHERE email = ?", [
    email,
  ]);
  if (existing) return;

  const hash = await bcrypt.hash(password, 10);
  await db.run(
    "INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'admin')",
    [email, hash]
  );
}

async function seedDestinations(db) {
  const count = await db.get("SELECT COUNT(*) as count FROM destinations");
  if (count.count > 0) return;

  const destinations = loadJson("destinations.json");
  const stmt =
    "INSERT INTO destinations (id, name, category, region, weather, duration, best_time, description, images_json, i18n_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  for (const item of destinations) {
    await db.run(stmt, [
      item.id,
      item.name,
      item.category,
      item.region,
      item.weather,
      item.duration,
      item.bestTime,
      item.description,
      JSON.stringify(item.images || []),
      JSON.stringify(item.i18n || {}),
    ]);
  }
}

async function seedStays(db) {
  const count = await db.get("SELECT COUNT(*) as count FROM stays");
  if (count.count > 0) return;

  const stays = loadJson("stays.json");
  const stmt =
    "INSERT INTO stays (id, name, location, type, price, rating, image, images_json, i18n_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  for (const item of stays) {
    await db.run(stmt, [
      item.id,
      item.name,
      item.location,
      item.type,
      item.price,
      item.rating,
      item.image,
      JSON.stringify(item.images || []),
      JSON.stringify(item.i18n || {}),
    ]);
  }
}

async function seedExperiences(db) {
  const experiences = loadJson("experiences.json");
  const stmt =
    "INSERT OR IGNORE INTO experiences (id, title, category, duration, rating, short, description, image, highlights_json, i18n_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  for (const item of experiences) {
    await db.run(stmt, [
      item.id,
      item.title,
      item.category,
      item.duration,
      item.rating,
      item.short,
      item.description,
      item.image,
      JSON.stringify(item.highlights || []),
      JSON.stringify(item.i18n || {}),
    ]);
  }
}

async function seedEvents(db) {
  const count = await db.get("SELECT COUNT(*) as count FROM events");
  if (count.count > 0) return;

  const events = loadJson("events.json");
  const stmt =
    "INSERT INTO events (id, title, category, location, start_date, end_date, description, image, i18n_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  for (const item of events) {
    await db.run(stmt, [
      item.id,
      item.title,
      item.category,
      item.location,
      item.startDate,
      item.endDate,
      item.description,
      item.image,
      JSON.stringify(item.i18n || {}),
    ]);
  }
}

async function seedAll() {
  const db = await getDb();
  await ensureAdmin(db);
  await seedDestinations(db);
  await seedStays(db);
  await seedExperiences(db);
  await seedEvents(db);
  await db.close();
}

seedAll()
  .then(() => {
    console.log("Seeding complete");
  })
  .catch((err) => {
    console.error("Seeding failed", err);
    process.exit(1);
  });
