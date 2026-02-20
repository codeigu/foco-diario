const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const DB_FILE = "db.json";

// Lê banco
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: {} }));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

// Salva banco
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Salvar progresso
app.post("/save", (req, res) => {
  const { name, tasksCompleted } = req.body;
  const db = readDB();
  const today = new Date().toISOString().split("T")[0];

  if (!db.users[name]) {
    db.users[name] = {};
  }

  db.users[name][today] = tasksCompleted;
  saveDB(db);

  res.json({ success: true });
});

// Buscar histórico
app.get("/history/:name", (req, res) => {
  const db = readDB();
  const user = db.users[req.params.name] || {};
  res.json(user);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta", PORT));
