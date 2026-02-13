const path = require("path");
const fs = require("fs");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const schema = require("./schema");

const dbPath =
  process.env.DB_PATH ||
  path.join(__dirname, "..", "data", "motherlanka.db");

let dbInstance = null;

async function ensureColumn(db, table, column, definition) {
  const columns = await db.all(`PRAGMA table_info(${table})`);
  const exists = columns.some((item) => item.name === column);
  if (!exists) {
    await db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

async function runMigrations(db) {
  await ensureColumn(db, "destinations", "i18n_json", "TEXT");
  await ensureColumn(db, "stays", "i18n_json", "TEXT");
  await ensureColumn(db, "experiences", "i18n_json", "TEXT");
  await ensureColumn(db, "events", "i18n_json", "TEXT");
}

async function getDb() {
  if (dbInstance) return dbInstance;

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await dbInstance.exec("PRAGMA foreign_keys = ON;");
  await dbInstance.exec(schema);
  await runMigrations(dbInstance);
  return dbInstance;
}

module.exports = { getDb };
