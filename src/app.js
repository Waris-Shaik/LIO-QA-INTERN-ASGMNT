import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user.js";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.js";

// Load .env file
dotenv.config({
  // path : './.env'
});

const app = express();

// Middlewares-Plugins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Cors midleware
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    Credential: true,
  })
);

//  Port
const PORT = process.env.PORT || 8000;

// Routers
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

export { app };
