const express = require("express");
const { fetchVehicle, createVehicle, updateVehicle, deleteVehicle } = require("../controllers/vehicleController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, fetchVehicle);
router.route("/create").post(protect, createVehicle);
router.route("/update").put(protect, updateVehicle);
router.route("/delete").delete(protect, deleteVehicle);

module.exports = router;
