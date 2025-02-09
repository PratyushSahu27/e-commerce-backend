import express from "express";
import {
  addProduct,
  removeProduct,
  getAllProducts,
} from "../controllers/ProductController.js";

const router = express.Router();

router.route("/addproduct").post(addProduct);

router.route("/removeproduct").post(removeProduct);

router.route("/allproducts").get(getAllProducts);

router.route("/newcollections").post(removeProduct);

export default router;
