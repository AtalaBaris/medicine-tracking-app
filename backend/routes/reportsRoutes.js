const express = require("express");
const { getReports } = require("../controllers/reportsController");

const router = express.Router();
router.get("/adherence", getReports);
router.get("/daily", getReports);

module.exports = router;
