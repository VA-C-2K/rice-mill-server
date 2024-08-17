import express from "express";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";
import connectDB from "./config/db.js";
// eslint-disable-next-line unused-imports/no-unused-vars
import colors from "colors";
import { routes } from "./routes/index.js";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [process.env.NODE_ENV === "prod" ? process.env.PROD_CLIENT_URL : "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

routes(app);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  // eslint-disable-next-line no-console
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);
  