import express from "express";
import {
  checkStatusAndRedirect,
  payment,
  paymentStatus,
} from "../controllers/PaymentController.js";

const router = express.Router();

// Router for phonepe payment.
router.route("/payment").post(payment);

// Router for phone payment status check
router.route("/payment/status/:merchantTransactionId").get(paymentStatus);

router
  .route("/payment/statusandredirect/:merchantTransactionId")
  .get(checkStatusAndRedirect);

export default router;
