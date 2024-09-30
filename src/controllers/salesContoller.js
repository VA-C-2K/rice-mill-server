import asyncHandler from "express-async-handler";
import Sales from "../models/salesModel.js";
import Product from "../models/productModel.js";
import isEmpty from "lodash/isEmpty.js";
import { createData, findData } from "../models/helpers/index.js";

export const fetchSales = asyncHandler(async (req, res) => {
  const {
    params: { id },
    query: { term, page = 1, perPage = 5, sort },
  } = req;
  const sortObject = convertSortStringToObject(sort);

  if (id) {
    const sale = await Sales.findById(id);
    if (sale) {
      return res.status(200).json(sale);
    } else {
      return res.status(404).json({ message: "Sales not found" });
    }
  }

  const filter = {};
  if (!isEmpty(term)) {
    filter.$or = [
      { "customer_details.phone_number": { $regex: term, $options: "i" } },
      { "customer_details.first_name": { $regex: term, $options: "i" } },
      { "customer_details.last_name": { $regex: term, $options: "i" } },
      { "customer_details.gov_or_cust": { $regex: term, $options: "i" } },
      { "product_details.name": { $regex: term, $options: "i" } },
      { "vehicle_details.vehicle_number": { $regex: term, $options: "i" } },
      { vehicle_number: { $regex: term, $options: "i" } },
    ];
  }

  const result = await findData({
    model: Sales,
    filter,
    page: +page,
    perPage,
    sort: sortObject,
    populate: [
      { path: "vehicle_details", select: "vehicle_number" },
      { path: "product_details", select: "name quantity current_rate" },
      { path: "customer_details", select: "phone_number first_name last_name gov_or_cust" },
    ],
  });
  return res.status(200).json(result);
});

export const createSales = asyncHandler(async (req, res) => {
  const {
    user: { _id: userId },
    body: payload,
  } = req;

  const remainigAmount = discount ? total_amount - discount - final_amount_paid : 0;
  if (!isEmpty(vehicle_details)) payload.vehicle_details = vehicle_details;
  if (!isEmpty(vehicle_number)) payload.vehicle_number = vehicle_number;

  return createData({ model: Sales, data: { ...payload, remainig_amount: remainigAmount, created_by: userId } })
    .then((res) => {
      return Product.updateOne({ _id: res.product_details }, { $inc: { quantity: -quantity } })
        .then(() => {
          return res.status(201).json({ message: "Sales created successfully" });
        })
        .catch(() => res.status(400).json({ message: "Something went wrong" }));
    })
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});

export const updateSales = asyncHandler(async (req, res) => {
  const {
    params: { id },
    body: payload,
    user: { _id: userId },
  } = req;

  const isExist = await Sales.findById(id);
  if (!isExist) {
    return res.status(400).json({ message: "Sale not found" });
  }

  const remainigAmount = payload.discount ? payload.total_amount - payload.discount - payload.final_amount_paid : 0;

  return updateData({ id, model: Sales, data: { ...payload, remainig_amount: remainigAmount, modified_by: userId } })
    .then((updatedSale) => {
      return Product.updateOne({ _id: updatedSale.product_details }, { $inc: { quantity: -updatedSale.quantity } })
        .then(() => {
          return res.status(200).json({ message: "Sales updated successfully" });
        })
        .catch(() => res.status(400).json({ message: "Something went wrong" }));
    })
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});

export const deleteSales = asyncHandler(async (req, res) => {
  const {
    params: { id },
  } = req;
  const isExist = await Sales.findById(id);
  if (!isExist) {
    return res.status(400).json({ message: "Sale not found" });
  }
  return Sales.findByIdAndDelete(id)
    .then(() => {
      return Product.updateOne({ _id: saleExists.product_details }, { $inc: { quantity: +saleExists.quantity } })
        .then(() => {
          return res.status(200).json({ message: "Sale deleted successfully" });
        })
        .catch(() => res.status(400).json({ message: "Something went wrong" }));
    })
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});
