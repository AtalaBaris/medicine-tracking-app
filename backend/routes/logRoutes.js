const express = require("express");
const { createLog, deleteTodayLog } = require("../controllers/logController");

const router = express.Router();
router.post("/", createLog);
router.delete("/today", deleteTodayLog);

module.exports = router;
