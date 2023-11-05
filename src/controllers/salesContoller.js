import asyncHandler from "express-async-handler";
import Sales from "../models/salesModel.js";
import Product from "../models/productModel.js";
import isEmpty from "lodash/isEmpty.js";

export const fetchSales = asyncHandler(async (req, res) => {
  const { sale_id, page, perPage = 5, next_due_on = -1, date = -1 } = req.query;
  try {
    if (sale_id) {
      const sale = await Sales.findById(sale_id);
      if (sale) {
        return res.status(200).json(sale);
      } else {
        return res.status(404).json({ message: "Sales not found" });
      }
    }

    const sales = await Sales.find({})
      .sort({ next_due_on, date })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("vehicle_details", "vehicle_number")
      .populate("product_details", "name quantity current_rate")
      .populate("customer_details", "phone_number first_name last_name gov_or_cust")
      .populate("created_by", "name phonenumber")
      .populate("modified_by", "name phonenumber");

    const totalSales = await Sales.countDocuments({});
    return res.status(200).json({
      sales,
      totalCount: totalSales,
      currentPage: page,
      totalPages: Math.ceil(totalSales / perPage),
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const createSales = asyncHandler(async (req, res) => {
  const { date, total_amount, discount, final_amount_paid, next_due_on, quantity, vehicle_number, vehicle_details, product_details, customer_details } =
    req.body;
  const user = req.user._id;

  if (!date || !total_amount || !quantity || !final_amount_paid || !final_amount_paid || !product_details || !customer_details) {
    return res.status(400).json({ message: "Please enter all fields" });
  }
  const remainigAmount = discount ? total_amount - discount - final_amount_paid : 0;
  try {
    const payload = {
      date,
      total_amount,
      discount,
      final_amount_paid,
      remainig_amount: remainigAmount,
      next_due_on,
      quantity,
      product_details,
      customer_details,
      created_by: user,
      modified_by: user,
    }
    if(!isEmpty(vehicle_details)) payload.vehicle_details = vehicle_details;
    if(!isEmpty(vehicle_number)) payload.vehicle_number = vehicle_number;
    const newSale = new Sales(payload);
    const savedSale = await newSale.save();
    if (savedSale) {
      return Product.updateOne({ _id: product_details }, { $inc: { quantity: -quantity } }).then(() => {
        return res.status(201).json({ message: "Sales created successfully" });
      });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export const updateSales = asyncHandler(async (req, res) => {
  const { sale_id, ...updateDetails } = req.body;
  const user = req.user._id;

  try {
    const salesExists = await Sales.findById(sale_id);
    if (!salesExists) {
      return res.status(404).json({ message: "Sales not found" });
    }
    const remainigAmount = updateDetails.discount ? updateDetails.total_amount - updateDetails.discount - updateDetails.final_amount_paid : 0;
    const payload = {
      ...updateDetails, remainig_amount: remainigAmount, created_by: user, modified_by: user
    }
    if(!isEmpty(updateDetails?.vehicle_details)) payload.vehicle_details = updateDetails?.vehicle_details;
    if(!isEmpty(updateDetails?.vehicle_number)) payload.vehicle_number = updateDetails?.vehicle_number;
    const updatedSale = await Sales.updateOne(
      { _id: sale_id },
      { $set: payload }
    );
    if (updatedSale.modifiedCount) {
      return Product.updateOne({ _id: updateDetails.product_details }, { $inc: { quantity: -updateDetails.quantity } }).then(() => {
        return res.status(200).json({ message: "Sales updated successfully" });
      });
    } else {
      return res.status(200).json({ message: "No changes were made" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export const deleteSales = asyncHandler(async (req, res) => {
  const { sale_id } = req.query;
  try {
    const saleExists = await Sales.findById(sale_id);
    if (!saleExists) {
      return res.status(404).json({ message: "Sales not found" });
    }
    const deletedSale = await Sales.deleteOne({ _id: sale_id });
    if (deletedSale.deletedCount > 0) {
      return Product.updateOne({ _id: saleExists.product_details }, { $inc: { quantity: +saleExists.quantity } }).then(() => {
        return res.status(200).json({ message: "Sales deleted successfully" });
      });
    } else {
      return res.status(200).json({ message: "No Sales was deleted" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
