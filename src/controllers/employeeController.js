const asyncHandler = require("express-async-handler");
const isEmpty = require("lodash/isEmpty");
const Employee = require("../models/employeeModel");

const fetchEmployee = asyncHandler(async (req, res) => {
  const { emp_id, page, perPage = 5 } = req.query;
  let { term } = req.query;
  try {
    if (emp_id) {
      const employee = await Employee.findById(emp_id);
      if (employee) {
        return res.status(200).json(employee);
      } else {
        return res.status(404).json({ message: "Employee not found" });
      }
    }
    let employees = await Employee.find({})
      .sort({ _id: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("created_by", "name phonenumber")
      .populate("modified_by", "name phonenumber");

    if (!isEmpty(term)) {
      employees = employees.filter(
        (employee) =>
          employee.phone_number.includes(term) ||
          employee.first_name.includes(term) ||
          employee.last_name.includes(term) ||
          employee.aadhar_card_no.includes(term)
      );
    }
    const totalEmployees = await Employee.find({});
    return res.status(200).json({
      employees,
      totalCount: totalEmployees.length,
      currentPage: page,
      totalPages: Math.ceil(totalEmployees.length / perPage),
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createEmployee = asyncHandler(async (req, res) => {
  const { phone_number, first_name, last_name, address, salary, aadhar_card_no, no_of_leaves, role, over_time_hrs } = req.body;
  const user = req.user._id;

  if (!phone_number || !first_name || !last_name || !salary || !role) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    let employeeExists;
    if (!isNaN(phone_number)) {
      employeeExists = await Employee.findOne({ phone_number });

      if (employeeExists) {
        return res.status(400).json({ message: "employee already exists" });
      }
    }
    const newEmployee = new Employee({
      phone_number,
      first_name,
      last_name,
      address,
      salary,
      aadhar_card_no,
      no_of_leaves,
      role,
      over_time_hrs,
      created_by: user,
      modified_by: user,
    });
    const savedEmployee = await newEmployee.save();
    if (savedEmployee) {
      return res.status(201).json({ message: "employee created successfully" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const updateEmployee = asyncHandler(async (req, res) => {
  const { emp_id, ...updateDetails } = req.body;
  const user = req.user._id;

  try {
    const employeeExists = await Employee.findById(emp_id);
    if (!employeeExists) {
      return res.status(404).json({ message: "employee not found" });
    }

    const updatedEmployee = await Employee.updateOne({ _id: emp_id }, { $set: { ...updateDetails, created_by: user, modified_by: user } });
    if (updatedEmployee.modifiedCount) {
      return res.status(200).json({ message: "employee updated successfully" });
    } else {
      return res.status(200).json({ message: "No changes were made" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const { emp_id } = req.query;
  try {
    const employeeExists = await Employee.findById(emp_id);
    if (!employeeExists) {
      return res.status(404).json({ message: "employee not found" });
    }
    const deletedEmployee = await Employee.deleteOne({ _id: emp_id });
    if (deletedEmployee.deletedCount > 0) {
      return res.status(200).json({ message: "employee deleted successfully" });
    } else {
      return res.status(200).json({ message: "No employee was deleted" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = { fetchEmployee, createEmployee, updateEmployee, deleteEmployee };
