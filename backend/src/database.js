
const Database = require("better-sqlite3");
const path = require("path");

// Localiza o banco na mesma pasta deste arquivo
const dbPath = path.join(__dirname, "tasks.db");

const db = new Database(dbPath);

// Criar tabela caso ainda não exista
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        completed INTEGER DEFAULT 0
    )
`);

module.exports = db;

