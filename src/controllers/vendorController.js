import asyncHandler from "express-async-handler";
import isEmpty from "lodash/isEmpty.js";
import Vendor from "../models/vendorModel.js";
import { createData, findData, updateData } from "../models/helpers/index.js";

export const fetchVendor = asyncHandler(async (req, res) => {
  const {
    params: { id },
    query: { term, page = 1, perPage = 5, list },
  } = req;

  if (id) {
    const vendor = await Vendor.findById(id);
    if (vendor) {
      return res.status(200).json(vendor);
    } else {
      return res.status(404).json({ message: "Vendor not found" });
    }
  }
  const filter = {};
  if (!isEmpty(term)) {
    filter.$or = [
      { phone_number: { $regex: term, $options: "i" } },
      { first_name: { $regex: term, $options: "i" } },
      { last_name: { $regex: term, $options: "i" } },
    ];
  } else if (!isEmpty(list) && list) {
    return res.status(200).json({
      vendors: await Vendor.find({}),
    });
  }

  const result = await findData({
    model: Vendor,
    filter,
    page: +page,
    perPage,
  });
  return res.status(200).json(result);
});

export const createVendor = asyncHandler(async (req, res) => {
  const {
    user: { _id: userId },
    body: payload,
  } = req;

  const isExist = await Product.findOne({ phone_number: payload.phone_number });
  if (isExist) {
    return res.status(400).json({ message: "Vehicle already exists" });
  }

  return createData({ model: Vendor, data: { ...payload, created_by: userId } })
    .then(() => res.status(201).json({ message: "Vehicle created successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});

export const updateVendor = asyncHandler(async (req, res) => {
  const {
    params: { id },
    body: payload,
    user: { _id: userId },
  } = req;

  const isExist = await Vehicle.findById(id);
  if (!isExist) {
    return res.status(400).json({ message: "Vendor not found" });
  }
  return updateData({ id, model: Vendor, data: { ...payload, modified_by: userId } })
    .then(() => res.status(201).json({ message: "Vendor updated successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});

export const deleteVendor = asyncHandler(async (req, res) => {
  const {
    params: { id },
  } = req;

  const isExist = await Vendor.findById(id);
  if (!isExist) {
    return res.status(400).json({ message: "Vendor not found" });
  }
  return Vendor.findByIdAndDelete(id)
    .then(() => res.status(201).json({ message: "Vendor deleted successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});
