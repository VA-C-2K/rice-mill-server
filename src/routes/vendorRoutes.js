import express from "express";
import { fetchVendor, createVendor, updateVendor, deleteVendor } from "../controllers/vendorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/:id?").get(protect, fetchVendor);
router.route("/create").post(protect, createVendor);
router.route("/:id").put(protect, updateVendor);
router.route("/:id").delete(protect, deleteVendor);

export default router;
