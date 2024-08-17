// Importing routes
import userRoutes from "./userRoutes.js";
import customerRoutes from "./customerRoutes.js";
import vendorRoutes from "./vendorRoutes.js";
import productRoutes from "./productRoutes.js";
import employeeRoutes from "./employeeRoutes.js";
import vehicleRoutes from "./vehicleRoutes.js";
import rowMaterialRoutes from "./rowMaterialRoutes.js";
import dailyExpenseRoutes from "./dailyExpenseRoutes.js";
import salesRoutes from "./salesRoutes.js";
import profitsRoutes from "./profitsRoutes.js";

// Function to set up routes
export const routes = (app) => {
  app.use("/user", userRoutes);
  app.use("/customer", customerRoutes);
  app.use("/vendor", vendorRoutes);
  app.use("/product", productRoutes);
  app.use("/employees", employeeRoutes);
  app.use("/vehicle", vehicleRoutes);
  app.use("/row-material", rowMaterialRoutes);
  app.use("/daily-expenses", dailyExpenseRoutes);
  app.use("/sales", salesRoutes);
  app.use("/profits", profitsRoutes);

  app.get("/", (req, res) => {
    res.send("API is running");
  });
};
