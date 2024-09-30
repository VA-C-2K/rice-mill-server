import Joi from "joi";
import { validatePayload } from "./index.js";

export const createProductSchemaValidation = validatePayload(
  Joi.object({
    name: Joi.string().required(),
    current_rate: Joi.number().required(),
    quantity: Joi.number().required(),
  })
);

export const updateProductSchemaValidation = validatePayload(
  Joi.object({
    name: Joi.string().required(),
    current_rate: Joi.number().required(),
    quantity: Joi.number().required(),
  }).min(1)
);
