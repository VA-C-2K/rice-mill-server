import asyncHandler from "express-async-handler";
import isEmpty from "lodash/isEmpty.js";
import DailyExpense from "../models/dailyExpenseModel.js";

export const fetchDailyExpense = asyncHandler(async (req, res) => {
  const { term, daily_expense_id, page, perPage = 5 } = req.query;
  try {
    if (daily_expense_id) {
      const dailyExpense = await DailyExpense.findById(daily_expense_id);
      if (dailyExpense) {
        return res.status(200).json(dailyExpense);
      } else {
        return res.status(404).json({ message: "Daily Expense not found" });
      }
    }

    const filter = {};
    if (!isEmpty(term)) {
      filter.$or = [{ entity: { $regex: term, $options: "i" } }, { description: { $regex: term, $options: "i" } }];
    }

    const dailyExpenses = await DailyExpense.find(filter)
      .sort({ _id: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("created_by", "name phonenumber")
      .populate("modified_by", "name phonenumber");

    const totalDailyExpenses = await DailyExpense.countDocuments(filter);
    return res.status(200).json({
      dailyExpenses,
      totalCount: totalDailyExpenses,
      currentPage: page,
      totalPages: Math.ceil(totalDailyExpenses / perPage),
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const createDailyExpense = asyncHandler(async (req, res) => {
  const { date, description, amount, entity } = req.body;
  const user = req.user._id;

  if (!date || !description || !amount || !entity) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const newDailyExpense = new DailyExpense({ date, description, amount, entity, created_by: user, modified_by: user });
    const savedDailyExpense = await newDailyExpense.save();
    if (savedDailyExpense) {
      return res.status(201).json({ message: "Daily Expense created successfully" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export const updateDailyExpense = asyncHandler(async (req, res) => {
  const { daily_expense_id, ...updateDetails } = req.body;
  const user = req.user._id;

  try {
    const dailyExpenseExists = await DailyExpense.findById(daily_expense_id);
    if (!dailyExpenseExists) {
      return res.status(404).json({ message: "Daily Expense not found" });
    }

    const updatedDailyExpense = await DailyExpense.updateOne({ _id: daily_expense_id }, { $set: { ...updateDetails, created_by: user, modified_by: user } });
    if (updatedDailyExpense.modifiedCount) {
      return res.status(200).json({ message: "Daily Expense updated successfully" });
    } else {
      return res.status(200).json({ message: "No changes were made" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export const deleteDailyExpense = asyncHandler(async (req, res) => {
  const { daily_expense_id } = req.query;
  try {
    const dailyExpenseExists = await DailyExpense.findById(daily_expense_id);
    if (!dailyExpenseExists) {
      return res.status(404).json({ message: "Daily Expense not found" });
    }
    const deletedDailyExpense = await DailyExpense.deleteOne({ _id: daily_expense_id });
    if (deletedDailyExpense.deletedCount > 0) {
      return res.status(200).json({ message: "Daily Expense deleted successfully" });
    } else {
      return res.status(200).json({ message: "No Daily Expense was deleted" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
