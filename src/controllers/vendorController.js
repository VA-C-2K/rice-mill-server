const asyncHandler = require("express-async-handler");
const isEmpty = require("lodash/isEmpty");
const Vendor = require("../models/vendorModel");

const fetchVendor = asyncHandler(async (req, res) => {
  const { vendor_id, page, perPage = 5 } = req.query;
  let { term } = req.query;
  if (term == " ") {
    term = "";
  }
  try {
    if (vendor_id) {
      const vendor = await Vendor.findById(vendor_id);
      if (vendor) {
        return res.status(200).json(vendor);
      } else {
        return res.status(404).json({ message: "Vendor not found" });
      }
    }
    const filter = {};
    if (!isEmpty(term)) {
      filter.$or = [
        { phone_number: { $regex: term, $options: 'i' } },
        { first_name: { $regex: term, $options: 'i' } },
        { last_name: { $regex: term, $options: 'i' } },
      ];
    }

    const totalVendors = await Vendor.countDocuments(filter);

    const vendors = await Vendor.find(filter)
      .sort({ _id: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("created_by", "name phonenumber")
      .populate("modified_by", "name phonenumber");

    return res.status(200).json({
      vendors,
      totalCount: totalVendors,
      currentPage: page,
      totalPages: Math.ceil(totalVendors / perPage),
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createVendor = asyncHandler(async (req, res) => {
  const { phone_number, first_name, last_name, address, gov_or_vendor } = req.body;
  const user = req.user._id;

  if (!phone_number || !first_name || !last_name || !address) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    let vendorExists;
    if (!isNaN(phone_number)) {
      vendorExists = await Vendor.findOne({ phone_number });

      if (vendorExists) {
        return res.status(400).json({ message: "Vendor already exists" });
      }
    }
    const newVendor = new Vendor({ phone_number, first_name, last_name, address, gov_or_vendor, created_by: user, modified_by: user });
    const savedVendor = await newVendor.save();
    if (savedVendor) {
      return res.status(201).json({ message: "Vendor created successfully" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const updateVendor = asyncHandler(async (req, res) => {
  const { vendor_id, ...updateDetails } = req.body;
  const user = req.user._id;

  try {
    const vendorExists = await Vendor.findById(vendor_id);
    if (!vendorExists) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const updatedVendor = await Vendor.updateOne({ _id: vendor_id }, { $set: { ...updateDetails, created_by: user, modified_by: user } });
    if (updatedVendor.modifiedCount) {
      return res.status(200).json({ message: "Vendor updated successfully" });
    } else {
      return res.status(200).json({ message: "No changes were made" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const deleteVendor = asyncHandler(async (req, res) => {
  const { vendor_id } = req.query;
  try {
    const vendorExists = await Vendor.findById(vendor_id);
    if (!vendorExists) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    const deletedVendor = await Vendor.deleteOne({ _id: vendor_id });
    if (deletedVendor.deletedCount > 0) {
      return res.status(200).json({ message: "Vendor deleted successfully" });
    } else {
      return res.status(200).json({ message: "No Vendor was deleted" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = { fetchVendor, createVendor, updateVendor, deleteVendor };
