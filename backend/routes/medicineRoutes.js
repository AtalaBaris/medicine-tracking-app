const express = require("express");
const {
  getMedicines,
  getMedicine,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  updateMedicineStock,
} = require("../controllers/medicineController");

const router = express.Router();

router.get("/", getMedicines);
router.post("/", addMedicine);
router.get("/:id", getMedicine);
router.put("/:id", updateMedicine);
router.patch("/:id/stock", updateMedicineStock);
router.delete("/:id", deleteMedicine);

module.exports = router;
