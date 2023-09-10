import express from "express";
import { fetchVehicle, createVehicle, updateVehicle, deleteVehicle } from "../controllers/vehicleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, fetchVehicle);
router.route("/create").post(protect, createVehicle);
router.route("/update").put(protect, updateVehicle);
router.route("/delete").delete(protect, deleteVehicle);

export default router;
