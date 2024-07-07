import express from "express";
const app = express();
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { API_BASE_ROUTE, smIdGenerator } from "./app/utils/Utils.js";
import { v4 as uuidv4 } from "uuid";
import PaymentRouter from "./app/routes/PaymentRouter.js";
import InvoiceRouter from "./app/routes/InvoiceRouter.js";
import ItemsRouter from "./app/routes/ItemsRouter.js";
import fs from "fs";
import https from "https";
import { Users, Product, Orders, USER_SCHEMA } from "./app/DB/models/Models.js";

import { Request, Response } from "express";

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/shooramall.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/shooramall.com/fullchain.pem"),
};

dotenv.config();
const port = process.env.PORT;
const MONGODB_URL = process.env.DB_URL as string;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(`${API_BASE_ROUTE}/images`, express.static("upload/images"));

// Routes
app.use(API_BASE_ROUTE, PaymentRouter);
app.use(API_BASE_ROUTE, InvoiceRouter);
app.use(API_BASE_ROUTE, ItemsRouter);

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
      image_url: `https://shooramall.com/api/images/${req.file.filename}`,
    });
  }
);

// MiddleWare to fetch user from database
const fetchuser = async (req: Request, res: Response, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.body.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};

app.get("/api/", (req: Request, res: Response) => {
  res.send("Root");
});

//Create an endpoint at ip/login for login the user and giving auth-token
app.post("/api/login", async (req: Request, res: Response) => {
  console.log("Login");
  let success = false;
  let user = await Users.findOne({ smId: req.body.smId });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      success = true;
      console.log(user.id);
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success, token });
    } else {
      return res.status(400).json({
        success: success,
        errors: "Invalid password. Please try again.",
      });
    }
  } else {
    return res.status(400).json({
      success: success,
      errors: "User not found. Please try with valid SM ID.",
    });
  }
});

//Create an endpoint at ip/login for login the user and giving auth-token
app.post("/api/adminlogin", async (req: Request, res: Response) => {
  console.log("Admin Login");
  let success = false;
  let user = await Users.findOne({ smId: req.body.smId });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      if (user.isAdmin && user.isAdmin === true) {
        const data = {
          user: {
            id: user.id,
          },
        };
        success = true;
        console.log(user.id);
        const token = jwt.sign(data, "secret_ecom");
        res.json({ success, token });
      } else {
        return res.status(400).json({
          success: success,
          errors: "You do not have admin access",
        });
      }
    } else {
      return res.status(400).json({
        success: success,
        errors: "Invalid password. Please try again.",
      });
    }
  } else {
    return res.status(400).json({
      success: success,
      errors: "User not found. Please try with valid SM ID.",
    });
  }
});

//Create an endpoint at ip/auth for registering the user in data base & sending token
app.post("/api/signup", async (req: Request, res: Response) => {
  console.log("Sign Up");
  let success = false;
  let check = await Users.findOne({ phoneNumber: req.body.phoneNumber });
  if (check) {
    return res.status(400).json({
      success: success,
      errors: "Existing user found with this Phone number",
    });
  }

  let check2 = await Users.findOne({ smId: req.body.guideId });
  if (!check2) {
    return res.status(400).json({
      success: success,
      errors: "Guide ID is invalid",
    });
  }

  // Generating new serial number
  let newSerialNumber = 0;

  if ((await Users.find().countDocuments()) > 0) {
    let lastSn = 0;
    await Users.findOne()
      .sort({ serialNumber: -1 })
      .limit(1)
      .then((latestEntry) => {
        if (latestEntry) {
          lastSn = latestEntry.serialNumber as number;
          console.log("Value:", lastSn);
        } else {
          console.log("No documents found");
        }
      })
      .catch((err: Error) => {
        console.log(err);
      });
    newSerialNumber = 1 + lastSn;
  }

  // Generating SM ID
  const newSmId = smIdGenerator(req.body.state, newSerialNumber);

  // Initializing cart
  let cart: { [key: number]: number } = {};
  for (let i: number = 0; i < 300; i++) {
    cart[i] = 0;
  }

  // Creating the user
  const user = new Users({
    serialNumber: newSerialNumber,
    smId: newSmId,
    guideId: req.body.guideId,
    name: req.body.fullName,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    password: req.body.password,
    addresses: [
      {
        state: req.body.state,
        city: req.body.city,
        address: req.body.address,
        pincode: req.body.pincode,
      },
    ],
    cartData: cart,
  });

  await user.save();
  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, "secret_ecom");
  success = true;
  res.json({ success, token, newSmId });
});

app.get("/api/allproducts", async (req: Request, res: Response) => {
  let products = await Product.find({});
  console.log("All Products");
  res.send(products);
});

app.get("/api/newcollections", async (req: Request, res: Response) => {
  let products = await Product.find({});
  let arr = products.slice(1).slice(-8);
  console.log("New Collections");
  res.send(arr);
});

app.get("/api/popularinwomen", async (req: Request, res: Response) => {
  let products = await Product.find({});
  // let arr = products.splice(0, 4);
  console.log("Popular In Women");
  res.send(products);
});

//Create an endpoint for saving the product in cart
app.post("/api/addtocart", fetchuser, async (req: Request, res: Response) => {
  console.log("Add Cart");
  let userData = await Users.findOne({ _id: req.body.user.id });
  if (userData) {
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate(
      { _id: req.body.user.id },
      { cartData: userData.cartData }
    );
  }
  res.send({ success: true });
});

// Endpoint to update all items to cart on login
app.post(
  "/api/addalltocart",
  fetchuser,
  async (req: Request, res: Response) => {
    console.log("Add all to cart on login");
    let userData = await Users.findOne({ _id: req.body.user.id });
    if (userData) {
      Object.keys(req.body.cartItems).forEach((itemId) => {
        if (req.body.cartItems[itemId] > 0) {
          userData.cartData[itemId] += req.body.cartItems[itemId];
        }
      });
      await Users.findOneAndUpdate(
        { _id: req.body.user.id },
        { cartData: userData.cartData }
      );
    }
    res.send({ success: true });
  }
);

// Endpoint to set cart
app.post("/api/setcart", async (req: Request, res: Response) => {
  console.log("setting cart");
  const user = await Users.findOneAndUpdate(
    { smId: req.body.smId },
    { cartData: req.body.cartItems }
  );
  console.log(user);
  res.send({ success: true });
});

//Create an endpoint for saving the product in cart
app.post(
  "/api/removefromcart",
  fetchuser,
  async (req: Request, res: Response) => {
    console.log("Remove Cart");
    let userData = await Users.findOne({ _id: req.body.user.id });
    if (userData) {
      if (userData.cartData[req.body.itemId] != 0) {
        userData.cartData[req.body.itemId] -= 1;
      }
      await Users.findOneAndUpdate(
        { _id: req.body.user.id },
        { cartData: userData.cartData }
      );
    }
    res.send({ success: true });
  }
);

//Create an endpoint for saving the product in cart
app.post("/api/getcart", fetchuser, async (req: Request, res: Response) => {
  console.log("Get Cart");
  let userData = await Users.findOne({ _id: req.body.user.id });
  res.json(userData ? userData.cartData : userData);
});

app.post("/api/getuser", fetchuser, async (req: Request, res: Response) => {
  console.log("Get User");
  let userData = await Users.findOne(
    { _id: req.body.user.id },
    {
      _id: 0,
      smId: 1,
      name: 1,
      phoneNumber: 1,
      addresses: 1,
      guideId: 1,
      email: 1,
      total_pv: 1,
    }
  );
  res.json(userData);
});

app.post("/api/addproduct", async (req: Request, res: Response) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    market_retail_price: req.body.retail_price,
    shoora_price: req.body.shoora_price,
    purchase_value: req.body.purchase_value,
    available: req.body.available,
    tax_rate: req.body.tax_rate,
    quantity_value: req.body.quantity_value,
    quantity_unit: req.body.quantity_unit,
  });
  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({ success: true, name: req.body.name });
});

app.post("/api/removeproduct", async (req: Request, res: Response) => {
  const product = await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({ success: true, name: req.body.name });
});

https.createServer(options, app).listen(process.env.PORT || port, () => {
  console.log("Server Running on port " + port);
});

app.post("/api/placeOrder", async (req: Request, res: Response) => {
  let orderId = uuidv4();
  const order = new Orders({
    orderId: orderId,
    orderItems: req.body.orderItems,
    smId: req.body.smId,
    orderValue: req.body.orderValue,
    orderPurchaseValue: req.body.orderPurchaseValue,
    address: req.body.address,
  });

  await Users.findOneAndUpdate(
    { smId: req.body.smId },
    { $inc: { total_pv: req.body.orderPurchaseValue } }
  );
  await order.save();
  console.log("Order placed successfully!");
  res.json({ success: true, orderId: orderId });
});

app.post("/api/addaddress", async (req: Request, res: Response) => {
  Users.findOneAndUpdate(
    { _id: req.body.user.id },
    {
      $push: {
        addresses: {
          address: req.body.user.address,
          city: req.body.user.city,
          state: req.body.user.state,
          pincode: req.body.user.pincode,
        },
      },
    }
  );
  res.send({ success: true });
});

app.post("/api/getdirectjoinees", async (req: Request, res: Response) => {
  let directJoinees;
  try {
    directJoinees = await Users.find(
      { guideId: req.body.user.smId },
      { _id: 0, smId: 1, name: 1, guideId: 1 }
    );
  } catch (e) {
    console.log("Unable to get direct joinees: ", e);
    res.send({ successful: false });
  }
  res.send({ directJoinees });
});

app.post("/api/getorders", async (req: Request, res: Response) => {
  const orders = await Orders.find({ smId: req.body.smId });
  res.send({ orders: orders });
});
