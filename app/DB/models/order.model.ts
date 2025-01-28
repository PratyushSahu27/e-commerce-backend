import { Schema } from "mongoose";
import { ADDRESS_SCHEMA } from "./address.model.js";

export const ORDER_SCHEMA = new Schema(
  {
    mode: String,
    buyer_name: String,
    buyer_contact: Number,
    branchId: {
      type: String,
    },
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
    deliveryCharge: {
      type: Number,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    address: ADDRESS_SCHEMA,
    status: {
      type: String,
    },
    alternateContactNumber: {
      type: Number,
    },
    transactionId: {
      type: String,
    },
    transactionStatus: {
      type: String,
    },
    deliveryDocketNumber: {
      type: String,
    },
    deliveryServiceName: {
      type: String,
    },
  },
  { timestamps: true }
);
