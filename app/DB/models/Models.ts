import { BRANCH_SCHEMA } from "./branch.model.js";
import { PRODUCT_SCHEMA } from "./product.model.js";
import { USER_SCHEMA } from "./user.model.js";
import { ORDER_SCHEMA } from "./order.model.js";
import mongoose from "mongoose";

// Order model
export const Orders = mongoose.model("orders", ORDER_SCHEMA);

// Users model
export const Users = mongoose.model("Users", USER_SCHEMA);

// Product model
export const Product = mongoose.model("Product", PRODUCT_SCHEMA);

// Branch model
export const Branch = mongoose.model("Branch", BRANCH_SCHEMA);
