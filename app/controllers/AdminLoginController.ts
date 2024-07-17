import { Request, Response } from "express";
import { Branch, Users } from "../DB/models/Models.js";
import jwt from "jsonwebtoken";

export default class AdminLoginController {
  adminLogin = async (request: Request, response: Response) => {
    console.log("Admin Login");
    let success = false;
    const branch = await Branch.findOne({ branch_id: request.body.branch_id });
    if (branch) {
      if (request.body.login_password === branch.login_password) {
        const data = {
          branch: {
            branch_id: branch.branch_id,
          },
        };
        success = true;
        const token = jwt.sign(data, "secret_ecom");
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
