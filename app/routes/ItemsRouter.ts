import express from "express";
import {
  getItems,
  getAllItems,
  updateItemAvailability,
  updateItemDetails,
} from "../controllers/ItemsController.js";

const router = express.Router();

// router.route("/createitem").post()

router.route("/getitems/:category").get(getItems);

router.route("/getallitems").get(getAllItems);

router.route("/updateitemavailability").post(updateItemAvailability);

router.route("/updateitemdetails").post(updateItemDetails);

export default router;
