import express from "express";
import { fetchRowMaterial, createRowMaterials, updateRowMaterial, deleteRowMaterial } from "../controllers/rowMaterialController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, fetchRowMaterial);
router.route("/create").post(protect, createRowMaterials);
router.route("/update").put(protect, updateRowMaterial);
router.route("/delete").delete(protect, deleteRowMaterial);

export default router;
