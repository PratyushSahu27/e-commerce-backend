import { removeAllQuantityOfItemFromCart } from "./../controllers/CartController";
import { fetchUserOrBranch } from "./../utils/router.utils";
import express from "express";
import {
  addAllToCart,
  getCart,
  setCart,
  removeFromCart,
  addToCart,
} from "../controllers/CartController";

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
