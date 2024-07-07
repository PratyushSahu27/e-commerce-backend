import express from "express";
import { payment, paymentStatus } from "../controllers/PaymentController.js";

const router = express.Router();

// Router for phonepe payment.
router.route("/payment").post(payment);

// Router for phone payment status check
router.route("/payment/status").post(paymentStatus);

export default router;
