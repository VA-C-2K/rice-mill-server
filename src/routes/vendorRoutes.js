const express = require("express");
const { fetchVendor, createVendor, updateVendor, deleteVendor } = require("../controllers/vendorController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, fetchVendor);
router.route("/create").post(protect, createVendor);
router.route("/update").put(protect, updateVendor);
router.route("/delete").delete(protect, deleteVendor);

module.exports = router;
