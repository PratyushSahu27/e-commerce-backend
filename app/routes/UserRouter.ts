import express from "express";
import {
  changeUserActiveStatus,
  getUser,
} from "../controllers/UserController.js";

const router = express.Router();

router.route("/getuser").post(getUser);

router.route("/changeUserActiveStatus").post(changeUserActiveStatus);

export default router;
