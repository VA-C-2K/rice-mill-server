import express from "express";
import { registerUser, authUser } from "../controllers/userControllers.js";
import { authUserSchemaValidation, registerUserSchemaValidation } from "../validations/auth-validation.js";

const router = express.Router();

router.route("/").post(registerUserSchemaValidation, registerUser);
router.route("/login").post(authUserSchemaValidation, authUser);

export default router;
