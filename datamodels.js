// Schema for order
const Order = mongoose.model("orders", {
    orderId: {
      type: Number,
      unique: true
    },
    orderItems: {
      type: Array
    },
    smId: {
      type: String
    },
    orderValue: {
      type: Number
    },
    orderPurchaseValue: {
      type: Number
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    deliveryAddress: {
      type: String,
    },
    pincode: {
      type: Number,
    },
  })

  const Address = new Schema({
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
      required: true
    },
    pincode: {
      type: Number,
      required: true
    },
  })
  
  // Schema for creating user model
  const Users = mongoose.model("Users", {
    serialNumber: {
      type: Number,
      unique: true,
    },
    smId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
    },
    phoneNumber: {
      type: Number,
      unique: true,
    },
    guideId: {
      type: String,
    },
    email: {
      type: String,
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
      default: 0
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
    market_retail_price: {
      type: Number,
    },
    shoora_price: {
      type: Number,
    },
    purchase_value: {
      type: Number,
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

  
  