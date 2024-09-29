import mongoose, { Schema } from "mongoose";

const ID_TYPES = {
  AADHAAR: "AADHAAR",
  PAN: "PAN",
  CHEQUE: "CHEQUE",
};

const KYC_DETAIL_SCHEMA = new Schema({
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
  idType: {
    type: String,
    enum: Object.values(ID_TYPES), // Validate against ID_TYPES values
  },
  verifierComments: {
    type: String,
  },
  status: {
    type: String,
  },
});

const KYC_DETAILS_SCHEMA = new Schema({
  aadhaarDetails: {
    type: KYC_DETAIL_SCHEMA,
    default: function () {
      return {
        idType: ID_TYPES.AADHAAR, // Default type for Aadhaar details
      };
    },
  },
  panDetails: {
    type: KYC_DETAIL_SCHEMA,
    default: function () {
      return {
        idType: ID_TYPES.PAN, // Default type for PAN details
      };
    },
  },
  chequeDetails: {
    type: KYC_DETAIL_SCHEMA,
    default: function () {
      return {
        idType: ID_TYPES.CHEQUE, // Default type for Cheque details
      };
    },
  },
});

const CUSTOMER_KYC_DETAILS_SCHEMA = new Schema({
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
});

export const KycModel = mongoose.model(
  "Customer_KYC",
  CUSTOMER_KYC_DETAILS_SCHEMA
);
