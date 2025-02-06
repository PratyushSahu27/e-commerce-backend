import { Schema } from "mongoose";
import { GuideSideEnum } from "../../utils/user.util.js";
import { ADDRESS_SCHEMA, IAddress } from "./address.model.js";

export interface IUser extends Document {
  [key: string]: any; // Allows dynamic property access
  serialNumber?: number;
  smId: string;
  name: string;
  guideId: string;
  email: string;
  phoneNumber: number;
  password?: string;
  cartData?: Record<string, any>; // Generic object type
  date?: Date;
  state?: string;
  city?: string;
  address?: string;
  pincode?: number;
  total_pv?: number;
  addresses?: IAddress[]; // Assuming ADDRESS_SCHEMA maps to IAddress
  isAdmin?: boolean;
  isActive?: boolean;
  guideSide: GuideSideEnum;
  parentId?: string;
  leftChild?: string | null;
  rightChild?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export const USER_SCHEMA = new Schema<IUser>(
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
    parentId: {
      type: String,
      default: "",
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
