import { Schema } from "mongoose";

export const ADDRESS_SCHEMA = new Schema(
  {
    name: {
      type: String,
    },
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
    },
    pincode: {
      type: Number,
      required: true,
    },
    phoneNumber: {
      type: Number,
    },
  },
  { timestamps: true }
);
