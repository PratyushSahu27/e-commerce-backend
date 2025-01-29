import { Schema } from "mongoose";
import { GuideSideEnum } from "../../utils/user.util.js";
import { ADDRESS_SCHEMA } from "./address.model.js";

export const USER_SCHEMA = new Schema(
  {
    serialNumber: {
      type: Number,
      unique: true,
    },
    smId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    guideId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      unique: true,
      required: true,
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
    isActive: {
      type: Boolean,
      default: false,
    },
    guideSide: {
      type: String,
      enum: Object.values(GuideSideEnum), // Use the enum values
      required: true,
    },
    leftChild: {
      type: String,
      default: null,
    },
    rightChild: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);
