import express from "express";
import { getUser } from "../controllers/UserController.js";

const router = express.Router();

router.route("/getuser").post(getUser);

export default router;
