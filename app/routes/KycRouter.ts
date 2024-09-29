import express from "express";
import { upload, uploadKycDocs } from "../controllers/KycUploadController.js";
import {
  getAllKycDetails,
  getKycDetails,
  isKycComplete,
  publishKycDetails,
} from "../controllers/KycController.js";

const router = express.Router();

router
  .route("/uploadkycdocs")
  .post(upload.single("kycdocument"), uploadKycDocs);

router.route("/getkycdetails").post(getKycDetails);

router.route("/getallkycdetails").get(getAllKycDetails);

router.route("/publishkyc").post(publishKycDetails);

router.route("/iskyccomplete").post(isKycComplete);

export default router;
