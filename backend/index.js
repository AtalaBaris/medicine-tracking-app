const express = require("express");
const cors = require("cors");
const { initDatabase } = require("./config/database");
const medicineRoutes = require("./routes/medicineRoutes");
const authRoutes = require("./routes/authRoutes");

const PORT = process.env.PORT || 3000;

initDatabase();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "İlaç takip API çalışıyor." });
});

app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint bulunamadı." });
});

app.listen(PORT, () => {
  console.log(`Backend http://localhost:${PORT} adresinde çalışıyor.`);
});
