import express from "express";
import {
  addAddress,
  changeUserActiveStatus,
  getDirectJoinees,
  getUser,
} from "../controllers/UserController.js";

const router = express.Router();

router.route("/getuser").post(getUser);

router.route("/changeUserActiveStatus").post(changeUserActiveStatus);

router.route("/getdirectjoinees").post(getDirectJoinees);

router.route("/addaddress").post(addAddress);

export default router;
