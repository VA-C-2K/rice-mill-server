import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

export const fetchProduct = asyncHandler(async (req, res) => {
  const { prod_id } = req.query;
  try {
    if (prod_id) {
      const product = await Product.findById(prod_id);
      if (product) {
        return res.status(200).json(product);
      } else {
        return res.status(404).json({ message: "Vendor not found" });
      }
    }
    const products = await Product.find({}).sort({ _id: 1 }).populate("created_by", "name phonenumber").populate("modified_by", "name phonenumber");

    return res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, quantity, current_rate } = req.body;
  const user = req.user._id;

  if (!name || !quantity || !current_rate) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    let productExists;
    if (!isNaN(name)) {
      productExists = await Product.findOne({ name });

      if (productExists) {
        return res.status(400).json({ message: "Product already exists" });
      }
    }
    const newProduct = new Product({ name, quantity, current_rate, created_by: user, modified_by: user });
    const savedProduct = await newProduct.save();
    if (savedProduct) {
      return res.status(201).json({ message: "Product created successfully" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { prod_id, ...updateDetails } = req.body;
  const user = req.user._id;

  try {
    const productExists = await Product.findById(prod_id);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.updateOne({ _id: prod_id }, { $set: { ...updateDetails, created_by: user, modified_by: user } });
    if (updatedProduct.modifiedCount) {
      return res.status(200).json({ message: "Product updated successfully" });
    } else {
      return res.status(200).json({ message: "No changes were made" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { prod_id } = req.query;
  try {
    const productExists = await Product.findById(prod_id);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }
    const deletedProduct = await Product.deleteOne({ _id: prod_id });
    if (deletedProduct.deletedCount > 0) {
      return res.status(200).json({ message: "Product deleted successfully" });
    } else {
      return res.status(200).json({ message: "No Product was deleted" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

