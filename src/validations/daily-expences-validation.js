import Joi from "joi";
import { validatePayload } from "./index.js";

export const createDailyExpenseSchemaValidation = validatePayload(
  Joi.object({
    date: Joi.date().required(),
    description: Joi.string().required(),
    amount: Joi.number().required(),
    entity: Joi.string().required(),
  })
);

export const updateDailyExpenseSchemaValidation = validatePayload(
  Joi.object({
    date: Joi.date().required(),
    description: Joi.string().required(),
    amount: Joi.number().required(),
    entity: Joi.string().required(),
  }).min(1)
);
