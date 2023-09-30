import express from "express";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import rowMaterialRoutes from "./routes/rowMaterialRoutes.js";
import dailyExpenseRoutes from "./routes/dailyExpenseRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import profitsRoutes from "./routes/profitsRoutes.js";
import cors from "cors";
import connectDB from "./config/db.js";
// eslint-disable-next-line unused-imports/no-unused-vars
import colors from "colors";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

if (process.env.NODE_ENV === "prod") {
  app.use(
    cors({
      origin: [process.env.PROD_CLIENT_URL],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );
} else {
  app.use(
    cors({
      origin: ["http://127.0.0.1:5173"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );
}

app.use("/user", userRoutes);
app.use("/customer", customerRoutes);
app.use("/vendor", vendorRoutes);
app.use("/product", productRoutes);
app.use("/employee", employeeRoutes);
app.use("/vehicle", vehicleRoutes);
app.use("/row-material", rowMaterialRoutes);
app.use("/daily-expenses", dailyExpenseRoutes);
app.use("/sales", salesRoutes);
app.use("/profits", profitsRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  // eslint-disable-next-line no-console
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);
