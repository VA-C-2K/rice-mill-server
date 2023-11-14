import asyncHandler from "express-async-handler";
import Sales from "../models/salesModel.js";
import RowProduct from "../models/rawMaterialModel.js";
import DailyExpenses from "../models/dailyExpenseModel.js";
import Employee from "../models/employeeModel.js";

export const fetchProfit = asyncHandler(async (req, res) => {
  try {
    const { to, from } = req.query;
    const dateFilter = {};
    if (to && from) {
      dateFilter.date = { $gte: new Date(from), $lte: new Date(to) };
    } else if (to) {
      dateFilter.date = { $lte: new Date(to) };
    } else if (from) {
      dateFilter.date = { $gte: new Date(from) };
    }

    const [sales, rowProduct, employee, dailyExpenses] = await Promise.all([
      Sales.find(dateFilter)
        .populate("product_details", "name quantity current_rate")
        .populate("customer_details", "phone_number first_name last_name gov_or_cust")
        .populate("vehicle_details", "vehicle_number"),
      RowProduct.find(dateFilter).populate("vendor_details", "first_name last_name gov_or_vendor phone_number"),
      Employee.find({}),
      DailyExpenses.find(dateFilter),
    ]);

    const saleAmount = sales.reduce((acc, curr) => acc + curr.final_amount_paid, 0);
    const employeeSalaries = employee.reduce((acc, curr) => acc + curr.salary, 0);
    const rowProductPurchase = rowProduct.reduce((acc, curr) => acc + curr.mrm_paid_price, 0);
    const currentExpenses = dailyExpenses.reduce((acc, curr) => acc + curr.amount, 0);

    const profit = saleAmount - currentExpenses - employeeSalaries - rowProductPurchase;

    const rowProductMRMRemainingToPayAmt = rowProduct.map((item) => ({
      id: item._id,
      remaining_price: item.remaining_price,
      remaining_price_paid_on: item.remaining_price_paid_on,
      vendor_details:item.vendor_details
    }));

    const filteredSales = sales.filter((item) => {
      if(item.remainig_amount > 0 && item.next_due_on != null){
        return item
      }
    })

    return res.status(200).json({
      profit,
      sales:filteredSales,
      mrm_remaining_to_pay_amount: rowProductMRMRemainingToPayAmt,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
