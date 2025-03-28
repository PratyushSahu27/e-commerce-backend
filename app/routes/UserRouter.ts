import express from "express";
import {
  addAddress,
  changeUserActiveStatus,
  changeUserPassword,
  getDirectJoinees,
  getUser,
  getUserTree,
} from "../controllers/UserController.js";

const router = express.Router();

router.route("/getuser").post(getUser);

router.route("/changeUserActiveStatus").post(changeUserActiveStatus);

router.route("/getdirectjoinees").post(getDirectJoinees);

router.route("/addaddress").post(addAddress);

router.route("/getusertree").post(getUserTree);

router.route("/changepassword").post(changeUserPassword)

export default router;
