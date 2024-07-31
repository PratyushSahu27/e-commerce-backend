import express from "express";
import { fetchUser } from "../utils/RouterUtils.js";
import BranchLoginController from "../controllers/BranchLoginController.js";

const router = express.Router();

const branchLoginController = new BranchLoginController();

router.route("/branchlogin").post(branchLoginController.branchLogin);

export default router;
