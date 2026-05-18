const { getDb } = require("../config/database");

function login(req, res) {
  try {
    const db = getDb();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "E-posta ve şifre zorunludur." });
    }

    const user = db
      .prepare(
        "SELECT user_id, name, email, phone, created_at FROM Users WHERE email = ? AND password = ?"
      )
      .get(email, password);

    if (!user) {
      return res.status(401).json({ error: "Geçersiz e-posta veya şifre." });
    }

    res.json({
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("login:", error);
    res.status(500).json({ error: "Giriş yapılamadı." });
  }
}

function register(req, res) {
  try {
    const db = getDb();
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Ad, e-posta ve şifre zorunludur." });
    }

    const existing = db
      .prepare("SELECT user_id FROM Users WHERE email = ?")
      .get(email);

    if (existing) {
      return res.status(409).json({ error: "Bu e-posta zaten kayıtlı." });
    }

    const result = db
      .prepare(
        "INSERT INTO Users (name, email, password, phone) VALUES (?, ?, ?, ?)"
      )
      .run(name, email, password, phone || null);

    const user = db
      .prepare(
        "SELECT user_id, name, email, phone, created_at FROM Users WHERE user_id = ?"
      )
      .get(result.lastInsertRowid);

    res.status(201).json({
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("register:", error);
    res.status(500).json({ error: "Kayıt oluşturulamadı." });
  }
}

module.exports = { login, register };
