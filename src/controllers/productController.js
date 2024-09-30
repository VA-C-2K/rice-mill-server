import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import { createData, findData, updateData } from "../models/helpers/index.js";

export const fetchProduct = asyncHandler(async (req, res) => {
  const { params: { id }, query: { page = 1, perPage = 5 } } = req;

  if (id) {
    const product = await Product.findById(id);
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  }

  const result = await findData({ model: Product, filter: {}, page: +page, perPage });
  return res.status(200).json(result);
});

export const createProduct = asyncHandler(async (req, res) => {
  const { user: { _id: userId }, body: payload } = req;

  const isExist = await Product.findOne({ name: payload.name });
  if (isExist) {
    return res.status(400).json({ message: "Product already exists" });
  }

  return createData({ model: Product, data: { ...payload, created_by: userId } })
    .then(() => res.status(201).json({ message: "Product created successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { params: { id }, body: payload, user: { _id: userId } } = req;

  const isExist = await Product.findById(id);
  if (!isExist) {
    return res.status(400).json({ message: "Product not found" });
  }

  return updateData({ id, model: Product, data: { ...payload, modified_by: userId } })
    .then(() => res.status(201).json({ message: "Product updated successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});

export const deleteProduct = asyncHandler(async (req, res) => {

  const { params: { id } } = req;
  const isExist = await Product.findById(id);
  if (!isExist) {
    return res.status(400).json({ message: "Product not found" });
  }
  return Product.findByIdAndDelete(id)
    .then(() => res.status(201).json({ message: "Product deleted successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});
