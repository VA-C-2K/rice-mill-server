/* eslint-disable no-console */
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewURLParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Mongo Connected:${conn.connection.host}`.blue.underline);
  } catch (error) {
    console.log(`Error:  ${error.message}`.red.bold);
    process.exit();
  }
};
export default connectDB;
