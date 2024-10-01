import express from "express";
import { fetchVendor, createVendor, updateVendor, deleteVendor } from "../controllers/vendorController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createVendorSchemaValidation, updateVendorSchemaValidation } from "../validations/vendor-validation.js";

const router = express.Router();

router.route("/:id?").get(protect, fetchVendor);
router.route("/").post(protect, createVendorSchemaValidation, createVendor);
router.route("/:id").put(protect, updateVendorSchemaValidation, updateVendor);
router.route("/:id").delete(protect, deleteVendor);

export default router;
