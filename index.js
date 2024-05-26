import express from "express";
const app = express();
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { smIdGenerator } from "./files/utils.js";
import { v4 as uuidv4 } from "uuid";
import { type } from "os";

dotenv.config();
const port = process.env.PORT;
const MONGODB_URL = process.env.DB_URL;

app.use(express.json());
app.use(cors());

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
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:8080/images/${req.file.filename}`,
  });
});
app.use("/images", express.static("upload/images"));

// MiddleWare to fetch user from database
const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};

const Address = new Schema({
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
});

// Schema for order
const Orders = mongoose.model("orders", {
  orderId: {
    type: String,
    unique: true,
  },
  orderItems: {
    type: Array,
  },
  smId: {
    type: String,
  },
  orderValue: {
    type: Number,
  },
  orderPurchaseValue: {
    type: Number,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  address: Address,
  completed: {
    type: Boolean,
    default: false,
  },
  alternateContactNumber: Number,
});

// Schema for creating user model
const Users = mongoose.model("Users", {
  serialNumber: {
    type: Number,
    unique: true,
  },
  smId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
  guideId: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  address: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  total_pv: {
    type: Number,
    default: 0,
  },
  addresses: [Address],
});

// Schema for creating Product
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  market_retail_price: {
    type: Number,
  },
  shoora_price: {
    type: Number,
  },
  purchase_value: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

app.get("/", (req, res) => {
  res.send("Root");
});

//Create an endpoint at ip/login for login the user and giving auth-token
app.post("/login", async (req, res) => {
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

//Create an endpoint at ip/auth for registering the user in data base & sending token
app.post("/signup", async (req, res) => {
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
    let lastSn;
    await Users.findOne()
      .sort({ serialNumber: -1 })
      .limit(1)
      .then((latestEntry) => {
        if (latestEntry) {
          // console.log('latest:', latestEntry);
          lastSn = latestEntry.serialNumber;
          console.log("Value:", lastSn);
        } else {
          console.log("No documents found");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    newSerialNumber = 1 + lastSn;
  }

  // Generating SM ID
  const newSmId = smIdGenerator(req.body.state, newSerialNumber);

  // Initializing cart
  let cart = {};
  for (let i = 0; i < 300; i++) {
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

app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All Products");
  res.send(products);
});

app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let arr = products.slice(1).slice(-8);
  console.log("New Collections");
  res.send(arr);
});

app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({});
  // let arr = products.splice(0, 4);
  console.log("Popular In Women");
  res.send(products);
});

//Create an endpoint for saving the product in cart
app.post("/addtocart", fetchuser, async (req, res) => {
  console.log("Add Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send({ success: true });
});

// Endpoint to update all items to cart on login
app.post("/addalltocart", fetchuser, async (req, res) => {
  console.log("Add all to cart on login");
  let userData = await Users.findOne({ _id: req.user.id });
  Object.keys(req.body.cartItems).forEach((itemId) => {
    if (req.body.cartItems[itemId] > 0) {
      userData.cartData[itemId] += req.body.cartItems[itemId];
    }
  });
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send({ success: true });
});

//Create an endpoint for saving the product in cart
app.post("/removefromcart", fetchuser, async (req, res) => {
  console.log("Remove Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] != 0) {
    userData.cartData[req.body.itemId] -= 1;
  }
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send({ success: true });
});

//Create an endpoint for saving the product in cart
app.post("/getcart", fetchuser, async (req, res) => {
  console.log("Get Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

app.post("/getuser", fetchuser, async (req, res) => {
  console.log("Get User");
  let userData = await Users.findOne(
    { _id: req.user.id },
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

app.post("/addproduct", async (req, res) => {
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
  });
  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({ success: true, name: req.body.name });
});

app.post("/removeproduct", async (req, res) => {
  const product = await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({ success: true, name: req.body.name });
});

app.listen(process.env.PORT || port, (error) => {
  if (!error) console.log("Server Running on port " + port);
  else console.log("Error : ", error);
});

app.post("/placeOrder", async (req, res) => {
  // let userData = await Users.findOne({ smId: req.body.smId });
  let orderId = uuidv4();
  const order = new Orders({
    orderId: orderId,
    orderItems: req.body.orderItems,
    smId: req.body.smId,
    orderValue: req.body.orderValue,
    orderPurchaseValue: req.body.orderPurchaseValue,
    address: req.body.address
  });
  await order.save();
  console.log("Order placed successfully!");
  res.json({ success: true, orderId: orderId });
});

app.post("/addaddress", async (req, res) => {
  Users.findOneAndUpdate(
    { _id: req.user.id },
    {
      $push: {
        addresses: {
          address: req.user.address,
          city: req.user.city,
          state: req.user.state,
          pincode: req.user.pincode,
        },
      },
    }
  );
  res.send({ success: true });
});

app.post("/getdirectjoinees", async (req, res) => {
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

app.post("/getorders", async (req, res) => {
  const orders = await Orders.find({smId: req.body.smId});
  res.send({orders: orders});
})
