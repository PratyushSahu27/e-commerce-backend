import express from "express";
import {
  generateInvoice,
  downloadInvoice,
} from "../controllers/InvoiceController.js";

const router = express.Router();

// Router for creating zoho customer.
router.route("/generateinvoice").post(generateInvoice);

router.route("/download-invoice/:filename").get(downloadInvoice);

export default router;
