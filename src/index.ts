const express = require("express");
const dotenv = require("dotenv");
import { Application } from "express";
import configureCors from "./config/cors";

import connectDB from "./config/db";
import userRoutes from "./routes/users";
import profileRoutes from "./routes/profile";

dotenv.config();
const app: Application = express();
configureCors(app);

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);

const port = process.env.PORT;
connectDB();
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
