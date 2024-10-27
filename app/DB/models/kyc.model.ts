import mongoose, { Schema } from "mongoose";

const KYC_DETAIL_SCHEMA = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    idNumber: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    bankName: {
      type: String,
    },
    ifsCode: {
      type: String,
    },
    verifierComments: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

const KYC_DETAILS_SCHEMA = new Schema({
  aadhaarDetails: {
    type: KYC_DETAIL_SCHEMA,
  },
  panDetails: {
    type: KYC_DETAIL_SCHEMA,
  },
  chequeDetails: {
    type: KYC_DETAIL_SCHEMA,
  },
  passportPhoto: {
    type: KYC_DETAIL_SCHEMA,
  },
});

const CUSTOMER_KYC_DETAILS_SCHEMA = new Schema(
  {
    smId: {
      type: String,
      required: true,
    },
    details: {
      type: KYC_DETAILS_SCHEMA,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export const KycModel = mongoose.model(
  "Customer_KYC",
  CUSTOMER_KYC_DETAILS_SCHEMA
);
