import mongoose from "mongoose";

const rawProductSchema = mongoose.Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    type_of_raw_material: { type: String, required: true },
    quantity: { type: Number, required: true },
    buying_price: { type: Number, required: true },
    mrm_paid_price: { type: Number, required: true },
    remaining_price: { type: Number, required: true },
    remaining_price_paid_on: { type: Date, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    modified_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vehicle_details: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    vendor_details: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  },
  {
    timestamps: true,
  }
);

const rawProduct = mongoose.model("Raw_product", rawProductSchema);

module.exports = rawProduct;
