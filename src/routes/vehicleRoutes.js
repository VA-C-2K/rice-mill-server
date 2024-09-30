import express from "express";
import { fetchVehicle, createVehicle, updateVehicle, deleteVehicle } from "../controllers/vehicleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createVehicleSchemaValidation, updateVehicleSchemaValidation } from "../validations/vehicle-validation.js";

const router = express.Router();

router.route("/:id?").get(protect, fetchVehicle);
router.route("/").post(protect, createVehicleSchemaValidation, createVehicle);
router.route("/:id").put(protect, updateVehicleSchemaValidation, updateVehicle);
router.route("/:id").delete(protect, deleteVehicle);

export default router;
