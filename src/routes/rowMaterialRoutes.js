import express from "express";
import { fetchRowMaterial, createRowMaterials, updateRowMaterial, deleteRowMaterial } from "../controllers/rowMaterialController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createRowMaterialSchemaValidation, updateRowMaterialSchemaValidation } from "../validations/row-material-validation..js";

const router = express.Router();

router.route("/:id?").get(protect, fetchRowMaterial);
router.route("/").post(protect, createRowMaterialSchemaValidation, createRowMaterials);
router.route("/:id").put(protect, updateRowMaterialSchemaValidation, updateRowMaterial);
router.route("/:id").delete(protect, deleteRowMaterial);

export default router;
