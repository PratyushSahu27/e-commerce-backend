const mongoose = require("mongoose");
const dotenv = require("dotenv")

dotenv.config();

//Connection URL
const MONGODB_URL = process.env.DB_URL

// Connect to the MongoDB server
export const connectToDb = () => mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Schema for creating user model
const Users = mongoose.model("Users", {
    name: {
      type: String,
    },
    phoneNumber: {
      type: Number
    },
    guideId: {
      type: Number
    },
    email: {
      type: String,
      unique: true,
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
      type: String
    },
    city: {
      type: String
    },
    address: {
      type: String
    },
    pincode: {
      type: Number
    }
  });
  
  // Schema for creating Product
  const Product = mongoose.model("Product", {
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
    new_price: {
      type: Number
    },
    old_price: {
      type: Number
    },
    date: {
      type: Date,
      default: Date.now,
    },
    available: {
      type: Boolean,
      default: true,
    },
  });
  
