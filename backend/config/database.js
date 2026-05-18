const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "database.sqlite");
const initSqlPath = path.join(__dirname, "init.sql");

let db;

function initDatabase() {
  const isNew = !fs.existsSync(dbPath);
  db = new Database(dbPath);
  db.pragma("foreign_keys = ON");

  if (isNew) {
    const schema = fs.readFileSync(initSqlPath, "utf8");
    db.exec(schema);
    console.log("SQLite veritabanı oluşturuldu ve seed verileri yüklendi.");
  }

  return db;
}

function getDb() {
  if (!db) {
    return initDatabase();
  }
  return db;
}

module.exports = { initDatabase, getDb };
