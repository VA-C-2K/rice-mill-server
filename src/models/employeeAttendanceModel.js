const mongoose = require("mongoose");

const employeeAttendanceSchema = mongoose.Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    present_or_absent: { type: String, required: true, trim: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    modified_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    employee_details: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  },
  {
    timestamps: true,
  }
);

const employeeAttendance = mongoose.model("Employee_attendance", employeeAttendanceSchema);

module.exports = employeeAttendance;
