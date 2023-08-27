const express = require("express");
const { fetchCustomer, createCustomer, updateCustomer, deleteCustomer } = require("../controllers/customerController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, fetchCustomer);
router.route("/create").post(protect, createCustomer);
router.route("/update").put(protect, updateCustomer);
router.route("/delete").delete(protect, deleteCustomer);

module.exports = router;
