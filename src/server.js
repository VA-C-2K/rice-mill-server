const express = require("express");
const dotenv = require("dotenv");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const productRoutes = require("./routes/productRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const cors = require("cors");
// const path = require("path");
const connectDB = require("./config/db");
// eslint-disable-next-line unused-imports/no-unused-vars
const colors = require("colors");
const path = require("path");

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/user", userRoutes);
app.use("/customer", customerRoutes);
app.use("/vendor", vendorRoutes);
app.use("/product", productRoutes);
app.use("/employee", employeeRoutes);

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "prod") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  // eslint-disable-next-line no-console
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);
