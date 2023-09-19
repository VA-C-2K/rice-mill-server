import mongoose from "mongoose";

const salesSchema = mongoose.Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    total_amount: { type: Number, required: true },
    quantity: { type: Number, required: true },
    discount: { type: Number, required: true },
    final_amount_paid: { type: Number, required: true },
    remainig_amount: { type: Number },
    next_due_on: { type: Date },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    modified_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vehicle_number: { type: String },
    product_details: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    customer_details: { type: mongoose.Schema.Types.ObjectId, ref: "Cutomer", required: true },
    vehicle_details: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  },
  {
    timestamps: true,
  }
);

const Sales = mongoose.model("Sales", salesSchema);

module.exports = Sales;
