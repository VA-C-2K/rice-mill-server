const asyncHandler = require("express-async-handler");
const isEmpty = require("lodash/isEmpty");
const Vehicle = require("../models/vehicleModel");

const fetchVehicle = asyncHandler(async (req, res) => {
  const { vehicle_id, page, perPage = 5 } = req.query;
  let { term } = req.query;
  if (term == " ") {
    term = "";
  }
  try {
    if (vehicle_id) {
      const vehicle = await Vehicle.findById(vehicle_id);
      if (vehicle) {
        return res.status(200).json(vehicle);
      } else {
        return res.status(404).json({ message: "Vehicle not found" });
      }
    }
    const filter = {};
    if (!isEmpty(term)) {
      filter.$or = [
        { vehicle_number: { $regex: term, $options: 'i' } }
      ];
    }

    const totalVehicles = await Vehicle.countDocuments(filter);

    const vehicles = await Vehicle.find(filter)
      .sort({ _id: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("created_by", "name phonenumber")
      .populate("modified_by", "name phonenumber")
      .populate("employee_details", "first_name last_name phone_number role");

    return res.status(200).json({
      vehicles: vehicles,
      totalCount: totalVehicles,
      currentPage: page,
      totalPages: Math.ceil(totalVehicles / perPage),
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createVehicle = asyncHandler(async (req, res) => {
  const { vehicle_number, employee_id } = req.body;
  const user = req.user._id;

  if (!vehicle_number || !employee_id) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    let vehicleExists;
    vehicleExists = await Vehicle.findOne({ vehicle_number });

    if (vehicleExists) {
      return res.status(400).json({ message: "Vehicle already exists" });
    }
    const newVehicle = new Vehicle({ vehicle_number, employee_details: employee_id, created_by: user, modified_by: user });
    const savedVehicle = await newVehicle.save();
    if (savedVehicle) {
      return res.status(201).json({ message: "Vehicle created successfully" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const updateVehicle = asyncHandler(async (req, res) => {
  const { vehicle_id, employee_id, ...updateDetails } = req.body;
  const user = req.user._id;
  try {
    const vehicleExists = await Vehicle.findById(vehicle_id);
    if (!vehicleExists) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const updatedVehicle = await Vehicle.updateOne({ _id: vehicle_id }, { $set: { employee_details: employee_id, ...updateDetails, created_by: user, modified_by: user } });
    if (updatedVehicle.modifiedCount) {
      return res.status(200).json({ message: "Vehicle updated successfully" });
    } else {
      return res.status(200).json({ message: "No changes were made" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const deleteVehicle = asyncHandler(async (req, res) => {
  const { vehicle_id } = req.query;
  try {
    const vehicleExists = await Vehicle.findById(vehicle_id);
    if (!vehicleExists) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    const deletedVehicle = await Vehicle.deleteOne({ _id: vehicle_id });
    if (deletedVehicle.deletedCount > 0) {
      return res.status(200).json({ message: "Vehicle deleted successfully" });
    } else {
      return res.status(200).json({ message: "No Vehicle was deleted" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = { fetchVehicle, createVehicle, updateVehicle, deleteVehicle };
