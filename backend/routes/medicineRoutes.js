const express = require("express");
const {
  getMedicines,
  addMedicine,
  deleteMedicine,
} = require("../controllers/medicineController");

const router = express.Router();

router.get("/", getMedicines);
router.post("/", addMedicine);
router.delete("/:id", deleteMedicine);

module.exports = router;
