const mongoose = require("mongoose");

const customerSchema = mongoose.Schema(
  {
    phone_number: { type: String, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    address: { type: String, required: true },
    gov_or_cust: { type: String, required: true, trim: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    modified_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Cutomer", customerSchema);

module.exports = Customer;
