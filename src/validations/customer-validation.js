import Joi from "joi";
import { validatePayload } from "./index.js";

export const createCustomerSchemaValidation = validatePayload(
  Joi.object({
    phone_number: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    address: Joi.string(),
    gov_or_cust: Joi.string().required(),
  })
);

export const updateCustomerSchemaValidation = validatePayload(
  Joi.object({
    phone_number: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    address: Joi.string(),
    gov_or_cust: Joi.string().required(),
  }).min(1)
);
