const express = require("express");
const { getDb } = require("../db");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const {
  resolveRequestLang,
  translateText,
  translateArray,
} = require("../utils/translate");

const router = express.Router();

const parseJsonField = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const withLocalizedFields = async ({
  db,
  table,
  id,
  row,
  lang,
  fields = [],
  arrayFields = [],
}) => {
  if (lang === "en") return row;

  const i18n = parseJsonField(row.i18n_json, {});
  const bucket = { ...(i18n[lang] || {}) };
  let dirty = false;
  const localized = { ...row };

  for (const field of fields) {
    const source = row[field];
    if (source == null || source === "") continue;

    if (!bucket[field]) {
      bucket[field] = await translateText(String(source), lang);
      dirty = true;
    }
    localized[field] = bucket[field] || source;
  }

  for (const field of arrayFields) {
    const source = Array.isArray(row[field]) ? row[field] : [];
    if (!source.length) continue;

    const hasValid =
      Array.isArray(bucket[field]) && bucket[field].length === source.length;
    if (!hasValid) {
      bucket[field] = await translateArray(source, lang);
      dirty = true;
    }
    localized[field] = bucket[field];
  }

  if (dirty) {
    i18n[lang] = bucket;
    await db.run(`UPDATE ${table} SET i18n_json = ? WHERE id = ?`, [
      JSON.stringify(i18n),
      id,
    ]);
  }

  return localized;
};

const normalizeDestination = async (db, row, lang) => {
  const localized = await withLocalizedFields({
    db,
    table: "destinations",
    id: row.id,
    row,
    lang,
    fields: [
      "name",
      "category",
      "region",
      "weather",
      "duration",
      "bestTime",
      "description",
    ],
  });
  const images = parseJsonField(localized.images_json, []);
  return {
    ...localized,
    images,
    image: images[0] || null,
  };
};

const normalizeStay = async (db, row, lang) => {
  const localized = await withLocalizedFields({
    db,
    table: "stays",
    id: row.id,
    row,
    lang,
    fields: ["name", "location", "type"],
  });
  const images = parseJsonField(localized.images_json, localized.image ? [localized.image] : []);
  return {
    ...localized,
    images,
    image: images[0] || localized.image || null,
  };
};

const normalizeExperience = async (db, row, lang) => {
  const rowWithHighlights = {
    ...row,
    highlights: parseJsonField(row.highlights_json, []),
  };
  const localized = await withLocalizedFields({
    db,
    table: "experiences",
    id: row.id,
    row: rowWithHighlights,
    lang,
    fields: ["title", "category", "duration", "short", "description"],
    arrayFields: ["highlights"],
  });
  return localized;
};

const normalizeEvent = async (db, row, lang) =>
  withLocalizedFields({
    db,
    table: "events",
    id: row.id,
    row,
    lang,
    fields: ["title", "category", "location", "description"],
  });

const existingI18n = async (db, table, id) => {
  const row = await db.get(`SELECT i18n_json FROM ${table} WHERE id = ?`, [id]);
  return parseJsonField(row?.i18n_json, {});
};

router.get("/destinations", async (req, res) => {
  const db = await getDb();
  const lang = resolveRequestLang(req);
  const rows = await db.all(
    "SELECT id, name, category, region, weather, duration, best_time as bestTime, description, images_json, i18n_json FROM destinations ORDER BY name"
  );
  return res.json(await Promise.all(rows.map((row) => normalizeDestination(db, row, lang))));
});

router.get("/destinations/:id", async (req, res) => {
  const db = await getDb();
  const lang = resolveRequestLang(req);
  const row = await db.get(
    "SELECT id, name, category, region, weather, duration, best_time as bestTime, description, images_json, i18n_json FROM destinations WHERE id = ?",
    [req.params.id]
  );
  if (!row) return res.status(404).json({ message: "Not found" });
  return res.json(await normalizeDestination(db, row, lang));
});

router.post("/destinations", requireAuth, requireAdmin, async (req, res) => {
  const {
    id,
    name,
    category,
    region,
    weather,
    duration,
    bestTime,
    description,
    images,
    i18n,
  } = req.body || {};

  if (!id || !name || !category || !Array.isArray(images)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const db = await getDb();
  await db.run(
    "INSERT INTO destinations (id, name, category, region, weather, duration, best_time, description, images_json, i18n_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      name,
      category,
      region || null,
      weather || null,
      duration || null,
      bestTime || null,
      description || null,
      JSON.stringify(images),
      JSON.stringify(i18n || {}),
    ]
  );
  return res.status(201).json({ ok: true });
});

router.put("/destinations/:id", requireAuth, requireAdmin, async (req, res) => {
  const {
    name,
    category,
    region,
    weather,
    duration,
    bestTime,
    description,
    images,
    i18n,
  } = req.body || {};

  const db = await getDb();
  const i18nData = i18n || (await existingI18n(db, "destinations", req.params.id));
  await db.run(
    "UPDATE destinations SET name = ?, category = ?, region = ?, weather = ?, duration = ?, best_time = ?, description = ?, images_json = ?, i18n_json = ? WHERE id = ?",
    [
      name,
      category,
      region,
      weather,
      duration,
      bestTime,
      description,
      JSON.stringify(images || []),
      JSON.stringify(i18nData),
      req.params.id,
    ]
  );
  return res.json({ ok: true });
});

router.delete("/destinations/:id", requireAuth, requireAdmin, async (req, res) => {
  const db = await getDb();
  await db.run("DELETE FROM destinations WHERE id = ?", [req.params.id]);
  return res.json({ ok: true });
});

router.get("/stays", async (req, res) => {
  const db = await getDb();
  const lang = resolveRequestLang(req);
  const rows = await db.all(
    "SELECT id, name, location, type, price, rating, image, images_json, i18n_json FROM stays ORDER BY name"
  );
  return res.json(await Promise.all(rows.map((row) => normalizeStay(db, row, lang))));
});

router.get("/stays/:id", async (req, res) => {
  const db = await getDb();
  const lang = resolveRequestLang(req);
  const row = await db.get(
    "SELECT id, name, location, type, price, rating, image, images_json, i18n_json FROM stays WHERE id = ?",
    [req.params.id]
  );
  if (!row) return res.status(404).json({ message: "Not found" });
  return res.json(await normalizeStay(db, row, lang));
});

router.post("/stays", requireAuth, requireAdmin, async (req, res) => {
  const { id, name, location, type, price, rating, image, images, i18n } = req.body || {};
  if (!id || !name || !location || !type || !price || !rating) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const resolvedImages = Array.isArray(images) ? images : [];
  const resolvedImage = image || resolvedImages[0] || null;
  if (!resolvedImage) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const db = await getDb();
  await db.run(
    "INSERT INTO stays (id, name, location, type, price, rating, image, images_json, i18n_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      name,
      location,
      type,
      price,
      rating,
      resolvedImage,
      JSON.stringify(resolvedImages),
      JSON.stringify(i18n || {}),
    ]
  );
  return res.status(201).json({ ok: true });
});

router.put("/stays/:id", requireAuth, requireAdmin, async (req, res) => {
  const { name, location, type, price, rating, image, images, i18n } = req.body || {};
  const resolvedImages = Array.isArray(images) ? images : [];
  const resolvedImage = image || resolvedImages[0] || null;
  const db = await getDb();
  const i18nData = i18n || (await existingI18n(db, "stays", req.params.id));
  await db.run(
    "UPDATE stays SET name = ?, location = ?, type = ?, price = ?, rating = ?, image = ?, images_json = ?, i18n_json = ? WHERE id = ?",
    [
      name,
      location,
      type,
      price,
      rating,
      resolvedImage,
      JSON.stringify(resolvedImages),
      JSON.stringify(i18nData),
      req.params.id,
    ]
  );
  return res.json({ ok: true });
});

router.delete("/stays/:id", requireAuth, requireAdmin, async (req, res) => {
  const db = await getDb();
  await db.run("DELETE FROM stays WHERE id = ?", [req.params.id]);
  return res.json({ ok: true });
});

router.get("/experiences", async (req, res) => {
  const db = await getDb();
  const lang = resolveRequestLang(req);
  const rows = await db.all(
    "SELECT id, title, category, duration, rating, short, description, image, highlights_json, i18n_json FROM experiences ORDER BY title"
  );
  return res.json(await Promise.all(rows.map((row) => normalizeExperience(db, row, lang))));
});

router.get("/experiences/:id", async (req, res) => {
  const db = await getDb();
  const lang = resolveRequestLang(req);
  const row = await db.get(
    "SELECT id, title, category, duration, rating, short, description, image, highlights_json, i18n_json FROM experiences WHERE id = ?",
    [req.params.id]
  );
  if (!row) return res.status(404).json({ message: "Not found" });
  return res.json(await normalizeExperience(db, row, lang));
});

router.post("/experiences", requireAuth, requireAdmin, async (req, res) => {
  const {
    id,
    title,
    category,
    duration,
    rating,
    short,
    description,
    image,
    highlights,
    i18n,
  } = req.body || {};

  if (!id || !title || !category || !rating) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const db = await getDb();
  await db.run(
    "INSERT INTO experiences (id, title, category, duration, rating, short, description, image, highlights_json, i18n_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      title,
      category,
      duration || null,
      rating,
      short || null,
      description || null,
      image || null,
      JSON.stringify(highlights || []),
      JSON.stringify(i18n || {}),
    ]
  );
  return res.status(201).json({ ok: true });
});

router.put("/experiences/:id", requireAuth, requireAdmin, async (req, res) => {
  const {
    title,
    category,
    duration,
    rating,
    short,
    description,
    image,
    highlights,
    i18n,
  } = req.body || {};
  const db = await getDb();
  const i18nData = i18n || (await existingI18n(db, "experiences", req.params.id));
  await db.run(
    "UPDATE experiences SET title = ?, category = ?, duration = ?, rating = ?, short = ?, description = ?, image = ?, highlights_json = ?, i18n_json = ? WHERE id = ?",
    [
      title,
      category,
      duration,
      rating,
      short,
      description,
      image,
      JSON.stringify(highlights || []),
      JSON.stringify(i18nData),
      req.params.id,
    ]
  );
  return res.json({ ok: true });
});

router.delete("/experiences/:id", requireAuth, requireAdmin, async (req, res) => {
  const db = await getDb();
  await db.run("DELETE FROM experiences WHERE id = ?", [req.params.id]);
  return res.json({ ok: true });
});

router.get("/events", async (req, res) => {
  const db = await getDb();
  const lang = resolveRequestLang(req);
  const rows = await db.all(
    "SELECT id, title, category, location, start_date as startDate, end_date as endDate, description, image, i18n_json FROM events ORDER BY start_date"
  );
  return res.json(await Promise.all(rows.map((row) => normalizeEvent(db, row, lang))));
});

router.get("/events/:id", async (req, res) => {
  const db = await getDb();
  const lang = resolveRequestLang(req);
  const row = await db.get(
    "SELECT id, title, category, location, start_date as startDate, end_date as endDate, description, image, i18n_json FROM events WHERE id = ?",
    [req.params.id]
  );
  if (!row) return res.status(404).json({ message: "Not found" });
  return res.json(await normalizeEvent(db, row, lang));
});

router.post("/events", requireAuth, requireAdmin, async (req, res) => {
  const {
    id,
    title,
    category,
    location,
    startDate,
    endDate,
    description,
    image,
    i18n,
  } = req.body || {};
  if (!id || !title || !category || !location || !startDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const db = await getDb();
  await db.run(
    "INSERT INTO events (id, title, category, location, start_date, end_date, description, image, i18n_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      title,
      category,
      location,
      startDate,
      endDate || null,
      description || null,
      image || null,
      JSON.stringify(i18n || {}),
    ]
  );
  return res.status(201).json({ ok: true });
});

router.put("/events/:id", requireAuth, requireAdmin, async (req, res) => {
  const { title, category, location, startDate, endDate, description, image, i18n } =
    req.body || {};
  const db = await getDb();
  const i18nData = i18n || (await existingI18n(db, "events", req.params.id));
  await db.run(
    "UPDATE events SET title = ?, category = ?, location = ?, start_date = ?, end_date = ?, description = ?, image = ?, i18n_json = ? WHERE id = ?",
    [
      title,
      category,
      location,
      startDate,
      endDate,
      description,
      image,
      JSON.stringify(i18nData),
      req.params.id,
    ]
  );
  return res.json({ ok: true });
});

router.delete("/events/:id", requireAuth, requireAdmin, async (req, res) => {
  const db = await getDb();
  await db.run("DELETE FROM events WHERE id = ?", [req.params.id]);
  return res.json({ ok: true });
});

module.exports = router;
