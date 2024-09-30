import Joi from "joi";
import { validatePayload } from "./index.js";

export const createRowMaterialSchemaValidation = validatePayload(
  Joi.object({
    date: Joi.date().required(),
    type_of_material: Joi.string().required(),
    quantity: Joi.number().required(),
    buying_price: Joi.number().required(),
    mrm_paid_price: Joi.number().required(),
    remaining_price: Joi.number().required(),
    remaining_price_paid_on: Joi.date().required(),
    vehicle_number: Joi.string(),
    vehicle_details: Joi.string(),
    vendor_details: Joi.string().required(),
  })
);

export const updateRowMaterialSchemaValidation = validatePayload(
  Joi.object({
    date: Joi.date().required(),
    type_of_material: Joi.string().required(),
    quantity: Joi.number().required(),
    buying_price: Joi.number().required(),
    mrm_paid_price: Joi.number().required(),
    remaining_price: Joi.number().required(),
    remaining_price_paid_on: Joi.date().required(),
    vehicle_number: Joi.string(),
    vehicle_details: Joi.string(),
    vendor_details: Joi.string().required(),
  }).min(1)
);
