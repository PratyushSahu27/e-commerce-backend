import express from "express";
import BranchLoginController from "../controllers/BranchLoginController.js";
import { getUserOrBranch } from "../controllers/GetUserOrBranchController.js";
import { fetchUserOrBranch } from "../utils/RouterUtils.js";

const router = express.Router();

const branchLoginController = new BranchLoginController();

router.route("/branchlogin").post(branchLoginController.branchLogin);

router.route("/getuserorbranch").get(fetchUserOrBranch, getUserOrBranch);

export default router;
