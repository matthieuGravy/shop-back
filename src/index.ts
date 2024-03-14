const express = require("express");
const dotenv = require("dotenv");
import { Application } from "express";
import connectDB from "./config/db";
dotenv.config();

const app: Application = express();
const port = process.env.PORT;
connectDB();
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
