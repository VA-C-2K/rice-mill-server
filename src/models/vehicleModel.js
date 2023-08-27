const mongoose = require("mongoose");

const vehicleSchema = mongoose.Schema(
  {
    vehicle_number: { type: Number, required: true, unique: true },
    phone_number: { type: Number, unique: true },
    driver_name: { type: String, required: true },
    vendor_or_mrm: { type: String, required: true, trim: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    modified_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    employee_details: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
