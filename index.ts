import fs from "fs";
import express, { NextFunction } from "express";
import https from "https";
import mongoose from "mongoose";
import multer, { MulterError } from "multer";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { API_BASE_ROUTE } from "./app/utils/registration.utils.js";
import { Request, Response } from "express";
import PaymentRouter from "./app/routes/PaymentRouter.js";
import InvoiceRouter from "./app/routes/InvoiceRouter.js";
import ItemsRouter from "./app/routes/ItemsRouter.js";
import LoginSignUpRouter from "./app/routes/LoginSignUpRouter.js";
import BranchRouter from "./app/routes/BranchRouter.js";
import OrderRouter from "./app/routes/OrderRouter.js";
import UserRouter from "./app/routes/UserRouter.js";
import KycRouter from "./app/routes/KycRouter.js";
import ProductRouter from "./app/routes/ProductRouter.js";
import CartRouter from "./app/routes/CartRouter.js";

const app = express();
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/shooramall.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/shooramall.com/fullchain.pem"),
};

dotenv.config();

// Environment variables
const port = process.env.PORT;
const MONGODB_URL = process.env.DB_URL as string;

// Setting up middlewares
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(`${API_BASE_ROUTE}/images`, express.static("upload/images"));
app.use(`${API_BASE_ROUTE}/kyc-docs`, express.static("upload/kyc-docs"));

// Setting up routers
app.use(API_BASE_ROUTE, PaymentRouter);
app.use(API_BASE_ROUTE, InvoiceRouter);
app.use(API_BASE_ROUTE, ItemsRouter);
app.use(API_BASE_ROUTE, BranchRouter);
app.use(API_BASE_ROUTE, LoginSignUpRouter);
app.use(API_BASE_ROUTE, OrderRouter);
app.use(API_BASE_ROUTE, UserRouter);
app.use(API_BASE_ROUTE, KycRouter);
app.use(API_BASE_ROUTE, ProductRouter);
app.use(API_BASE_ROUTE, CartRouter);

// Handling errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MulterError) {
    // Multer-specific errors

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).send("File size exceeds limit.");
    }
  } else if (err instanceof Error) {
    if (err.message === "Invalid_file_type")
      return res.status(400).send(err.message);
  }
  console.log(err);
  res.status(500).send("An unexpected error occurred.");
});

// Database Connection With MongoDB
try {
  mongoose.connect(MONGODB_URL);
  console.log("Connected to MongoDB");
} catch (e) {
  console.log("Error in connecting to MongoDB - ", e);
}

//Image Storage Engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    console.log(file);
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });
app.post(
  "/api/upload",
  upload.single("product"),
  (req: Request, res: Response) => {
    res.json({
      success: 1,
      image_url: `https://shooramall.com/api/images/${req.file?.filename}`,
    });
  }
);

https.createServer(options, app).listen(process.env.PORT || port, () => {
  console.log("Server Running on port " + port);
});
