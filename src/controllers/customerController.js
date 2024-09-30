import asyncHandler from "express-async-handler";
import isEmpty from "lodash/isEmpty.js";
import Customer from "../models/customerModel.js";
import { createData, findData, updateData } from "../models/helpers/index.js";

export const fetchCustomer = asyncHandler(async (req, res) => {
  const {
    params: { id },
    query: { term, page = 1, perPage = 5 },
  } = req;

  if (id) {
    const customer = await Customer.findById(id);
    if (customer) {
      return res.status(200).json(customer);
    } else {
      return res.status(404).json({ message: "Customer not found" });
    }
  }

  const filter = {};
  if (!isEmpty(term)) {
    filter.$or = [
      { phone_number: { $regex: term, $options: "i" } },
      { first_name: { $regex: term, $options: "i" } },
      { last_name: { $regex: term, $options: "i" } },
    ];
  }

  const result = await findData({ model: Customer, filter, page: +page, perPage });
  return res.status(200).json(result);
});

export const createCustomer = asyncHandler(async (req, res) => {
  const {
    user: { _id: userId },
    body: payload,
  } = req;

  const isExist = await Customer.findOne({ phone_number: payload.phone_number });
  if (isExist) {
    return res.status(400).json({ message: "Customer already exists" });
  }

  return createData({ model: Customer, data: { ...payload, created_by: userId } })
    .then(() => res.status(201).json({ message: "Customer created successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const {
    params: { id },
    body: payload,
    user: { _id: userId },
  } = req;

  const isExist = await Customer.findById(id);
  if (!isExist) {
    return res.status(400).json({ message: "Customer not found" });
  }
  return updateData({ id, model: Customer, data: { ...payload, modified_by: userId } })
    .then(() => res.status(201).json({ message: "Customer updated successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const {
    params: { id },
  } = req;

  const isExist = await Customer.findById(id);
  if (!isExist) {
    return res.status(400).json({ message: "Customer not found" });
  }
  return Customer.findByIdAndDelete(id)
    .then(() => res.status(201).json({ message: "Customer deleted successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});
