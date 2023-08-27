const mongoose = require("mongoose");

const profitsSchema = mongoose.Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    profit: { type: Number, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    modified_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    daily_expense_details: [{ type: mongoose.Schema.Types.ObjectId, ref: "Daily_expense" }],
    raw_material_details: [{ type: mongoose.Schema.Types.ObjectId, ref: "Raw_product" }],
    employee_details: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    sales_details: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sales" }],
  },
  {
    timestamps: true,
  }
);

const Profits = mongoose.model("Profits", profitsSchema);

module.exports = Profits;
