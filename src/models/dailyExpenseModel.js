import mongoose from "mongoose";

const dailyExpenseSchema = mongoose.Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    entity: { type: String, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    modified_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const dailyExpense = mongoose.model("Daily_expense", dailyExpenseSchema);

export default dailyExpense;
