import asyncHandler from "express-async-handler";
import isEmpty from "lodash/isEmpty.js";
import Employee, { findEmployees } from "../models/employeeModel.js";

export const fetchEmployee = asyncHandler(async (req, res) => {
  const { params: { id: emp_id }, query: { term, role, page = 1, perPage = 5 } } = req;

  if (emp_id) {
    const employee = await Employee.findById(emp_id);
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
    ];
  } else if (!isEmpty(role)) {
    filter.role = { $regex: role, $options: "i" };
  }

  const result = await findEmployees({ filter, page: +page, perPage });
  return res.status(200).json(result);
});

export const createEmployee = asyncHandler(async (req, res) => {
  const { user: { _id: userId }, body: payload } = req;

  const isExist = await Employee.findOne({ phone_number: payload.phone_number });;
  if (isExist) {
    return res.status(400).json({ message: "Employee already exists" });
  }

  const payload_ = {
    ...payload,
    created_by: userId,
    modified_by: userId,
  };

  const newEmployee = new Employee(payload_);
  const savedEmployee = await newEmployee.save();
  if (savedEmployee) {
    return res.status(201).json({ message: "Employee created successfully" });
  }
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const { params: { id: emp_id }, body: payload, user: { _id: userId } } = req;

  const updatedEmployee = await Employee.findByIdAndUpdate(
    emp_id,
    { ...payload, modified_by: userId },
    { new: true }
  );

  if (updatedEmployee) {
    return res.status(200).json({ message: "Employee updated successfully" });
  } else {
    return res.status(404).json({ message: "Employee not found" });
  }
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  const { params: { id: emp_id } } = req;

  const deletedEmployee = await Employee.findByIdAndDelete(emp_id);
  if (deletedEmployee) {
    return res.status(200).json({ message: "Employee deleted successfully" });
  } else {
    return res.status(404).json({ message: "Employee not found" });
  }
});