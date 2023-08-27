const express = require("express");
const { fetchEmployee, createEmployee, updateEmployee, deleteEmployee } = require("../controllers/employeeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, fetchEmployee);
router.route("/create").post(protect, createEmployee);
router.route("/update").put(protect, updateEmployee);
router.route("/delete").delete(protect, deleteEmployee);

module.exports = router;
