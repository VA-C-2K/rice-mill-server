import express from "express";
import { fetchVendor, createVendor, updateVendor, deleteVendor } from "../controllers/vendorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, fetchVendor);
router.route("/create").post(protect, createVendor);
router.route("/update").put(protect, updateVendor);
router.route("/delete").delete(protect, deleteVendor);

export default router;
