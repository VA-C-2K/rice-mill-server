import asyncHandler from "express-async-handler";
import isEmpty from "lodash/isEmpty.js";
import Employee from "../models/employeeModel.js";
import { createData, findData, updateData } from "../models/helpers/index.js";

export const fetchEmployee = asyncHandler(async (req, res) => {
  const {
    params: { id },
    query: { term, page = 1, perPage = 5 },
  } = req;

  if (id) {
    const employee = await Employee.findById(id);
    if (employee) {
      return res.status(200).json(employee);
    } else {
      return res.status(404).json({ message: "Employee not found" });
    }
  }

  const filter = {};
  if (!isEmpty(term)) {
    filter.$or = [
      { phone_number: { $regex: term, $options: "i" } },
      { first_name: { $regex: term, $options: "i" } },
      { last_name: { $regex: term, $options: "i" } },
      { role: { $regex: term, $options: "i" } },
      { aadhar_card_no: { $regex: term, $options: "i" } },
    ];
  }

  const result = await findData({ model: Employee, filter, page: +page, perPage });
  return res.status(200).json(result);
});

export const createEmployee = asyncHandler(async (req, res) => {
  const {
    user: { _id: userId },
    body: payload,
  } = req;

  const isExist = await Employee.findOne({ phone_number: payload.phone_number });
  if (isExist) {
    return res.status(400).json({ message: "Employee already exists" });
  }

  return createData({ model: Employee, data: { ...payload, created_by: userId } })
    .then(() => res.status(201).json({ message: "Employee created successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});

export const updateEmployee = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
    body: payload,
    user: { _id: userId },
  } = req;
  const isExist = await Employee.findById(id);
  if (!isExist) {
    return res.status(400).json({ message: "Employee not found" });
  }
  return updateData({ id, model: Employee, data: { ...payload, modified_by: userId } })
    .then(() => res.status(201).json({ message: "Employee updated successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});

export const deleteEmployee = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
  } = req;
  const isExist = await Employee.findById(id);
  if (!isExist) {
    return res.status(400).json({ message: "Employee not found" });
  }
  return Employee.findByIdAndDelete(id)
    .then(() => res.status(201).json({ message: "Employee deleted successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});
