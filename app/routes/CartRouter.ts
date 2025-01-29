import { fetchUserOrBranch } from "./../utils/router.utils.js";
import express from "express";
import {
  addAllToCart,
  getCart,
  setCart,
  removeFromCart,
  addToCart,
  removeAllQuantityOfItemFromCart,
} from "../controllers/CartController.js";

const router = express.Router();

router.route("/getcart").post(getCart);

router.route("/setcart").post(setCart);

router.route("/addtocart").post(fetchUserOrBranch, addToCart);

router.route("/addalltocart").post(fetchUserOrBranch, addAllToCart);

router.route("/removefromcart").post(fetchUserOrBranch, removeFromCart);

router
  .route("/removeallquantityofitemfromcart")
  .post(fetchUserOrBranch, removeAllQuantityOfItemFromCart);

export default router;
