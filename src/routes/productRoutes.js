const express = require("express");
const { fetchProduct, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, fetchProduct);
router.route("/create").post(protect, createProduct);
router.route("/update").put(protect, updateProduct);
router.route("/delete").delete(protect, deleteProduct);

module.exports = router;
