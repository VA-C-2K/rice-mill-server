import asyncHandler from "express-async-handler";
import isEmpty from "lodash/isEmpty.js";
import DailyExpense from "../models/dailyExpenseModel.js";
import { createData, findData, updateData } from "../models/helpers/index.js";

export const fetchDailyExpense = asyncHandler(async (req, res) => {
  const { params: { id }, query: { term, page = 1, perPage = 5 } } = req;

  if (id) {
    const dailyExpense = await DailyExpense.findById(id);
    if (dailyExpense) {
      return res.status(200).json(dailyExpense);
    } else {
      return res.status(404).json({ message: "Daily Expense not found" });
    }
  }

  const filter = {};
  if (!isEmpty(term)) {
    filter.$or = [
      { entity: { $regex: term, $options: "i" } },
      { description: { $regex: term, $options: "i" } }
    ];
  }

  const result = await findData({ model: DailyExpense, filter, page: +page, perPage });
  return res.status(200).json(result);
});

export const createDailyExpense = asyncHandler(async (req, res) => {
  const { user: { _id: userId }, body: payload } = req;

  return createData({ model: DailyExpense, data: { ...payload, created_by: userId } })
    .then(() => res.status(201).json({ message: "Daily Expense created successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});

export const updateDailyExpense = asyncHandler(async (req, res) => {
  const { params: { id }, body: payload, user: { _id: userId } } = req;

  const isExist = await DailyExpense.findById(id);
  if (!isExist) {
    return res.status(404).json({ message: "Daily Expense not found" });
  }
  return updateData({ id, model: DailyExpense, data: { ...payload, modified_by: userId } })
    .then(() => res.status(201).json({ message: "Daily Expense updated successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});

export const deleteDailyExpense = asyncHandler(async (req, res) => {
  const { params: { id } } = req;
  const isExist = await DailyExpense.findById(id);
  if (!isExist) {
    return res.status(400).json({ message: "Daily Expense not found" });
  }

  return DailyExpense.findByIdAndDelete(id)
    .then(() => res.status(201).json({ message: "Daily Expense deleted successfully" }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});
