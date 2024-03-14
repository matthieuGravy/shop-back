import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbURI = process.env.DB_URI || "";

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("⚡️ Connected to DB");
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
