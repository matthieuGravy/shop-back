import express from "express";
import dotenv from "dotenv";
const cors = require("cors");

dotenv.config();

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [process.env.PRODUCTION_ORIGIN || "default_production_origin"]
      : [
          process.env.FRONTEND_URL_1 || "default_frontend_url_1",
          process.env.FRONTEND_URL_2 || "default_frontend_url_2",
        ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

console.log("CORS options:", corsOptions);

const configureCors = (app: express.Application) => {
  app.use(cors(corsOptions));
};

export default configureCors;
