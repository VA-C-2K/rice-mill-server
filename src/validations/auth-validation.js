import Joi from "joi";
import { validatePayload } from "./index.js";

export const registerUserSchemaValidation = validatePayload(
    Joi.object({
        name: Joi.string().required(),
        phonenumber: Joi.string().required(),
        password: Joi.string().required(),
    })
);

export const authUserSchemaValidation = validatePayload(
    Joi.object({
        phonenumber: Joi.string().required(),
        password: Joi.string().required(),
    })
);
