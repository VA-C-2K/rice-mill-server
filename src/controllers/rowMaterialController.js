import asyncHandler from "express-async-handler";
import RowMaterial from "../models/rawMaterialModel.js";
import { findData, createData, updateData } from "../models/helpers/index.js";

export const fetchRowMaterial = asyncHandler(async (req, res) => {
  const {
    params: { id },
    query: { page = 1, perPage = 5 },
  } = req;

  if (id) {
    const row_material = await RowMaterial.findById(id);
    if (row_material) {
      return res.status(200).json(row_material);
    } else {
      return res.status(404).json({ message: "Row Material not found" });
    }
  }
  const result = await findData({
    model: RowMaterial,
    filter: {},
    page: +page,
    perPage,
    populate: [
      { path: "vehicle_details", select: "vehicle_number" },
      { path: "vendor_details", select: "first_name last_name gov_or_vendor" },
    ],
    sort: { remaining_price_paid_on, date },
  });
  return res.status(200).json(result);
});

export const createRowMaterials = asyncHandler(async (req, res) => {
  const {
    user: { _id: userId },
    body: payload,
  } = req;

  return createData({ model: RowMaterial, data: { ...payload, created_by: userId } })
    .then(() => res.status(201).json({ message: "Row Material created successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});

export const updateRowMaterial = asyncHandler(async (req, res) => {
  const {
    params: { id },
    body: payload,
    user: { _id: userId },
  } = req;
  const isExist = await RowMaterial.findById(id);
  if (!isExist) {
    return res.status(400).json({ message: "Row material not found" });
  }
  return updateData({ id, model: RowMaterial, data: { ...payload, modified_by: userId } })
    .then(() => res.status(201).json({ message: "Row material updated successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});

export const deleteRowMaterial = asyncHandler(async (req, res) => {
  const {
    params: { id },
  } = req;
  const isExist = await RowMaterial.findById(id);
  if (!isExist) {
    return res.status(400).json({ message: "Row Material not found" });
  }
  return RowMaterial.findByIdAndDelete(id)
    .then(() => res.status(201).json({ message: "Row Material deleted successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});
