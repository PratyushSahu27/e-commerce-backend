import express from "express";
import {
  getOrders,
  markOrderAsCompleted,
  placeOrder,
  updateOrderStatus,
  updateOrderTransactionId,
  updateOrderTransactionStatus,
} from "../controllers/OrderController.js";

const router = express.Router();

router.route("/getorders").post(getOrders);

router.route("/placeorder").post(placeOrder);

router.route("/updateordertransactionid").post(updateOrderTransactionId);

router.route("/updateorderstatus").post(updateOrderStatus);

router
  .route("/updateordertransactionstatus")
  .post(updateOrderTransactionStatus);

router.route("/markorderascompleted").post(markOrderAsCompleted);

export default router;
