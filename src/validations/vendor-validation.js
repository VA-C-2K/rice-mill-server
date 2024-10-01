import Joi from "joi";
import { validatePayload } from "./index.js";

export const createVendorSchemaValidation = validatePayload(
  Joi.object({
    phone_number: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    address: Joi.string().required(),
    gov_or_vendor: Joi.string().required(),
  })
);

export const updateVendorSchemaValidation = validatePayload(
  Joi.object({
    phone_number: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    address: Joi.string().required(),
    gov_or_vendor: Joi.string().required(),
  }).min(1)
);
