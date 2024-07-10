import mongoose, { Schema } from "mongoose";

// Schema for address
export const ADDRESS_SCHEMA = new Schema({
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
  landmark: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
});

// Schema for order
export const ORDER_SCHEMA = new Schema({
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
  address: ADDRESS_SCHEMA,
  completed: {
    type: Boolean,
    default: false,
  },
  alternateContactNumber: Number,
});

// Schema for creating user model
export const USER_SCHEMA = new Schema({
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
  phoneNumber: {
    type: Number,
    unique: true,
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
  addresses: [ADDRESS_SCHEMA],
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// Schema for product model
export const PRODUCT_SCHEMA = new Schema({
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
    required: true,
  },
  shoora_price: {
    type: Number,
    required: true,
  },
  purchase_value: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
  tax_rate: {
    type: String,
    required: true,
  },
});

// Schema for branch model
export const BRANCH_SCHEMA = new Schema({
  branch_id: {
    type: String,
    unique: true,
    required: true,
  },
  branch_name: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
    type: ADDRESS_SCHEMA,
    required: true,
  },
  gst_no: {
    type: Number,
    required: true,
  },
  fssai_no: {
    type: Number,
    required: true,
  },
});

// Schema for order
export const Orders = mongoose.model("orders", ORDER_SCHEMA);

// Users model
export const Users = mongoose.model("Users", USER_SCHEMA);

// Product model
export const Product = mongoose.model("Product", PRODUCT_SCHEMA);
