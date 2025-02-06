import { Schema } from "mongoose";

export interface IAddress extends Document {
  name: String;
  state: String;
  city: String;
  address: String;
  landmark?: String;
  pincode: Number;
  phoneNumber: Number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const ADDRESS_SCHEMA = new Schema<IAddress>(
  {
    name: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
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
      required: true,
    },
  },
  { timestamps: true }
);
