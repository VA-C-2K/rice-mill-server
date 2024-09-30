import Joi from "joi";
import { validatePayload } from "./index.js";

export const createSalesSchemaValidation = validatePayload(
  Joi.object({
    date: Joi.date().required(),
    total_amount: Joi.number().required(),
    quantity: Joi.number().required(),
    discount: Joi.number(),
    final_amount_paid: Joi.number().required(),
    next_due_on: Joi.date(),
    vehicle_number: Joi.string(),
    vehicle_details: Joi.string(),
    product_details: Joi.string().required(),
    customer_details: Joi.string().required(),
  })
);

export const updateSaleslSchemaValidation = validatePayload(
  Joi.object({
    date: Joi.date().required(),
    total_amount: Joi.number().required(),
    quantity: Joi.number().required(),
    discount: Joi.number(),
    final_amount_paid: Joi.number().required(),
    next_due_on: Joi.date(),
    vehicle_number: Joi.string(),
    vehicle_details: Joi.string(),
    product_details: Joi.string().required(),
    customer_details: Joi.string().required(),
  }).min(1)
);
