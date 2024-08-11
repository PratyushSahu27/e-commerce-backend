import express from "express";
import {
  getItems,
  getAllItems,
  updateItemAvailability,
} from "../controllers/ItemsController.js";

const router = express.Router();

// router.route("/createitem").post()

router.route("/getitems/:category").get(getItems);

router.route("/getallitems").get(getAllItems);

router.route("/updateitemavailability").post(updateItemAvailability);

export default router;
