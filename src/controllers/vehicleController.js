import asyncHandler from "express-async-handler";
import isEmpty from "lodash/isEmpty.js";
import Vehicle from "../models/vehicleModel.js";

export const fetchVehicle = asyncHandler(async (req, res) => {
  const {
    params: { id },
    query: { term, page = 1, perPage = 5, list },
  } = req;
  if (id) {
    const vehicle = await Vehicle.findById(id);
    if (vehicle) {
      return res.status(200).json(vehicle);
    } else {
      return res.status(404).json({ message: "Sales not found" });
    }
  }
  const filter = {};
  if (!isEmpty(term)) {
    filter.$or = [{ vehicle_number: { $regex: term, $options: "i" } }];
  } else if (!isEmpty(list) && list) {
    return res.status(200).json({
      vehicles: await Vehicle.find({}).populate("employee_details", "first_name last_name phone_number role"),
    });
  }

  const result = await findData({
    model: Vehicle,
    filter,
    page: +page,
    perPage,
    sort: sortObject,
    populate: [{ path: "employee_details", select: "first_name last_name phone_number role" }],
  });
  return res.status(200).json(result);
});

export const createVehicle = asyncHandler(async (req, res) => {
  const {
    user: { _id: userId },
    body: payload,
  } = req;

  const isExist = await Product.findOne({ vehicle_number: payload.vehicle_number });
  if (isExist) {
    return res.status(400).json({ message: "Vehicle already exists" });
  }

  return createData({ model: Vehicle, data: { ...payload, employee_details: payload.employee_id, created_by: userId } })
    .then(() => res.status(201).json({ message: "Vehicle created successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const { vehicle_id, employee_id, ...updateDetails } = req.body;
  const user = req.user._id;
  const {
    params: { id },
    body: payload,
    user: { _id: userId },
  } = req;

  const vehicleExists = await Vehicle.findById(vehicle_id);
  if (!vehicleExists) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  const isExist = await Vehicle.findById(id);
  if (!isExist) {
    return res.status(400).json({ message: "Vehicle not found" });
  }

  return updateData({ id, model: Vehicle, data: { ...payload, employee_details: payload.employee_id, modified_by: userId } })
    .then(() => res.status(201).json({ message: "Vehicle updated successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  const {
    params: { id },
  } = req;

  const isExist = await Vehicle.findById(id);
  if (!isExist) {
    return res.status(400).json({ message: "Vehicle not found" });
  }
  return Vehicle.findByIdAndDelete(id)
    .then(() => res.status(201).json({ message: "Vehicle deleted successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});
