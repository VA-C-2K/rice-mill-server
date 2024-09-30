import Joi from "joi";
import { validatePayload } from "./index.js";

export const createVehicleSchemaValidation = validatePayload(
  Joi.object({
    vehicle_number: Joi.string().required(),
    employee_id: Joi.string().required(),
  })
);

export const updateVehicleSchemaValidation = validatePayload(
  Joi.object({
    vehicle_number: Joi.string().required(),
    employee_id: Joi.string().required(),
  }).min(1)
);
