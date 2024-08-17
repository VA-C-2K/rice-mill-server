import Joi from 'joi';

export const createEmployeeSchema = Joi.object({
  phone_number: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  address: Joi.string(),
  salary: Joi.number().required(),
  aadhar_card_no: Joi.string(),
  no_of_leaves: Joi.number(),
  role: Joi.string().required(),
  over_time_hrs: Joi.number()
});

export const updateEmployeeSchema = Joi.object({
  phone_number: Joi.string(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  address: Joi.string(),
  salary: Joi.number(),
  aadhar_card_no: Joi.string(),
  no_of_leaves: Joi.number(),
  role: Joi.string(),
  over_time_hrs: Joi.number()
}).min(1);