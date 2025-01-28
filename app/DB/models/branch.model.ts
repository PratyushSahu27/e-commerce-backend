import { Schema } from "mongoose";
import { ADDRESS_SCHEMA } from "./address.model.js";

export const BRANCH_SCHEMA = new Schema(
  {
    serialNumber: {
      type: Number,
      unique: true,
    },
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
      type: String,
      required: true,
    },
    fssai_no: {
      type: Number,
      required: true,
    },
    login_password: {
      type: String,
      required: true,
    },
    email_address: {
      type: String,
    },
  },
  { timestamps: true }
);
