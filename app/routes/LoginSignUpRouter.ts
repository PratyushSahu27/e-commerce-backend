import express from "express";
import AdminLoginController from "../controllers/AdminLoginController.js";
import { fetchUser } from "../utils/RouterUtils.js";

const router = express.Router();

const adminLoginController = new AdminLoginController();

router.route("/adminlogin").post(adminLoginController.adminLogin);

export default router;
