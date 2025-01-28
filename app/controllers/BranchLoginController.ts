import { Request, Response } from "express";
import { Branch } from "../DB/models/models.js";
import jwt from "jsonwebtoken";
import { SECRET_KEYWORD } from "../utils/router.utils.js";

export default class BranchLoginController {
  branchLogin = async (request: Request, response: Response) => {
    console.log("Branch Login");
    let success = false;
    const branch = await Branch.findOne({ branch_id: request.body.branch_id });
    if (branch) {
      if (request.body.password === branch.login_password) {
        const data = {
          branch: {
            branch_id: branch.branch_id,
          },
        };
        success = true;
        const token = jwt.sign(data, SECRET_KEYWORD);
        response.json({ success, token });
      } else {
        return response.status(400).json({
          success: success,
          errors: "Invalid password. Please try again.",
        });
      }
    } else {
      return response.status(400).json({
        success: success,
        errors: "Branch not found. Please try with valid Branch ID.",
      });
    }
  };
}
