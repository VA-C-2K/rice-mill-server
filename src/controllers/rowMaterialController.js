import asyncHandler from "express-async-handler";
import RowMaterial from "../models/rawMaterialModel.js";

export const fetchRowMaterial = asyncHandler(async (req, res) => {
  const { row_id, page = 1, perPage = 5 } = req.query;
  try {
    if (row_id) {
      const row_material = await RowMaterial.findById(row_id);
      if (row_material) {
        return res.status(200).json(row_material);
      } else {
        return res.status(404).json({ message: "Row Material not found" });
      }
    }

    const totalRowMaterial = await RowMaterial.countDocuments({});

    const row_materials = await RowMaterial.find({})
      .sort({ remaining_price_paid_on: 1, date: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("vehicle_details", "vehicle_number")
      .populate("vendor_details", "first_name last_name gov_or_vendor")
      .populate("created_by", "name phonenumber")
      .populate("modified_by", "name phonenumber");

    return res.status(200).json({
      row_materials: row_materials,
      totalCount: totalRowMaterial,
      currentPage: page,
      totalPages: Math.ceil(totalRowMaterial / perPage),
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const createRowMaterials = asyncHandler(async (req, res) => {
  const {
    date,
    type_of_material,
    quantity,
    buying_price,
    mrm_paid_price,
    remaining_price,
    remaining_price_paid_on,
    vehicle_number,
    vehicle_details,
    vendor_details,
  } = req.body;
  const user = req.user._id;

  if (!date || !type_of_material || !quantity || !buying_price || !mrm_paid_price) {
    if (!vehicle_number || !vehicle_details) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
  }
  try {
    const newRowMaterial = new RowMaterial({
      date,
      type_of_material,
      quantity,
      buying_price,
      mrm_paid_price,
      remaining_price,
      remaining_price_paid_on,
      vehicle_number,
      vehicle_details,
      vendor_details,
      created_by: user,
      modified_by: user,
    });
    const savedRowMaterial = await newRowMaterial.save();
    if (savedRowMaterial) {
      return res.status(201).json({ message: "Row Material created successfully" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export const updateRowMaterial = asyncHandler(async (req, res) => {
  const { row_id, ...updateDetails } = req.body;
  const user = req.user._id;

  try {
    const rowMaterialExists = await RowMaterial.findById(row_id);
    if (!rowMaterialExists) {
      return res.status(404).json({ message: "Row material not found" });
    }

    const updatedRowMaterial = await RowMaterial.updateOne({ _id: row_id }, { $set: { ...updateDetails, created_by: user, modified_by: user } });
    if (updatedRowMaterial.modifiedCount) {
      return res.status(200).json({ message: "Row material updated successfully" });
    } else {
      return res.status(200).json({ message: "No changes were made" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export const deleteRowMaterial = asyncHandler(async (req, res) => {
  const { row_id } = req.query;
  try {
    const rowMaterialExists = await RowMaterial.findById(row_id);
    if (!rowMaterialExists) {
      return res.status(404).json({ message: "Row Material not found" });
    }
    const deletedRowMaterial = await RowMaterial.deleteOne({ _id: row_id });
    if (deletedRowMaterial.deletedCount > 0) {
      return res.status(200).json({ message: "Row Material deleted successfully" });
    } else {
      return res.status(200).json({ message: "No Row Material was deleted" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
