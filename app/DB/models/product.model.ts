import { Schema } from "mongoose";

export const PRODUCT_SCHEMA = new Schema(
  {
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
    quantity_value: {
      type: Number,
      required: true,
    },
    quantity_unit: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
