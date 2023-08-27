const asyncHandler = require("express-async-handler");
const isEmpty = require("lodash/isEmpty");
const Customer = require("../models/customerModel");

const fetchCustomer = asyncHandler(async (req, res) => {
  const { cust_id, page, perPage = 5 } = req.query;
  let { term } = req.query;
  if (term == " ") {
    term = "";
  }
  try {
    if (cust_id) {
      const customer = await Customer.findById(cust_id);
      if (customer) {
        return res.status(200).json(customer);
      } else {
        return res.status(404).json({ message: "Customer not found" });
      }
    }
    let customers = await Customer.find({})
      .sort({ _id: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("created_by", "name phonenumber")
      .populate("modified_by", "name phonenumber");

    if (!isEmpty(term)) {
      customers = customers.filter((cust) => cust.phone_number.includes(term) || cust.first_name.includes(term) || cust.last_name.includes(term));
    }
    const totalCustomers = await Customer.find({});
    return res.status(200).json({
      customers,
      totalCount: totalCustomers.length,
      currentPage: page,
      totalPages: Math.ceil(totalCustomers.length / perPage),
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createCustomer = asyncHandler(async (req, res) => {
  const { phone_number, first_name, last_name, address, gov_or_cust } = req.body;
  const user = req.user._id;

  if (!phone_number || !first_name || !last_name || !address) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    let customerExists;
    if (!isNaN(phone_number)) {
      customerExists = await Customer.findOne({ phone_number });

      if (customerExists) {
        return res.status(400).json({ message: "Customer already exists" });
      }
    }
    const newCustomer = new Customer({ phone_number, first_name, last_name, address, gov_or_cust, created_by: user, modified_by: user });
    const savedCustomer = await newCustomer.save();
    if (savedCustomer) {
      return res.status(201).json({ message: "Customer created successfully" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const updateCustomer = asyncHandler(async (req, res) => {
  const { cust_id, ...updateDetails } = req.body;
  const user = req.user._id;

  try {
    const customerExists = await Customer.findById(cust_id);
    if (!customerExists) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const updatedCustomer = await Customer.updateOne({ _id: cust_id }, { $set: { ...updateDetails, created_by: user, modified_by: user } });
    if (updatedCustomer.modifiedCount) {
      return res.status(200).json({ message: "Customer updated successfully" });
    } else {
      return res.status(200).json({ message: "No changes were made" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const { cust_id } = req.query;
  try {
    const customerExists = await Customer.findById(cust_id);
    if (!customerExists) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const deletedCustomer = await Customer.deleteOne({ _id: cust_id });
    if (deletedCustomer.deletedCount > 0) {
      return res.status(200).json({ message: "Customer deleted successfully" });
    } else {
      return res.status(200).json({ message: "No customer was deleted" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = { fetchCustomer, createCustomer, updateCustomer, deleteCustomer };
