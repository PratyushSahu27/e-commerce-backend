import { signUp } from "./../controllers/SignUpController.js";
import express from "express";
import BranchLoginController from "../controllers/BranchLoginController.js";
import { getUserOrBranch } from "../controllers/GetUserOrBranchController.js";
import { fetchUserOrBranch } from "../utils/router.utils.js";
import { userLogin } from "../controllers/UserLoginController.js";

const router = express.Router();

const branchLoginController = new BranchLoginController();

router.route("/signup").post(signUp);

router.route("/login").post(userLogin);

router.route("/branchlogin").post(branchLoginController.branchLogin);

router.route("/getuserorbranch").get(fetchUserOrBranch, getUserOrBranch);

export default router;
