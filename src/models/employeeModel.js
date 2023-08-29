const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    address: { type: String },
    salary: { type: Number, required: true },
    aadhar_card_no: { type: String, unique: true },
    no_of_leaves: { type: Number },
    role: { type: String, required: true, trim: true }, //manager,operator,helper,driver,accountant,security,labour
    over_time_hrs: { type: Number },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    modified_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
