import express from "express";
import BranchRegistrationController from "../controllers/BranchRegistrationController.js";

const router = express.Router();
const controller = new BranchRegistrationController();

router.route("/registerbranch").post(controller.RegisterBranch);

export default router;
