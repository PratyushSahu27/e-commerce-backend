import { Request, Response } from "express";
import { Branch, Users } from "../DB/models/models.js";

export const getUserOrBranch = async (request: Request, response: Response) => {
  console.log("Get user or branch");
  try {
    if (request.body.user) {
      let userData = await Users.findOne(
        { smId: request.body.user.id },
        {
          _id: 0,
          smId: 1,
          name: 1,
          phoneNumber: 1,
          addresses: 1,
          guideId: 1,
          email: 1,
          total_pv: 1,
          isActive: 1
        }
      );
      response.json({ userData, state: "User" });
    } else if (request.body.branch) {
      let userData = await Branch.findOne(
        {
          branch_id: request.body.branch.branch_id,
        },
        {
          _id: 0,
          branch_name: 1,
          branch_id: 1,
          address: 1,
          email_address: 1,
        }
      );
      response.json({ userData, state: "Branch" });
    }
  } catch {
    return response.status(400).json({
      success: false,
      errors: `Failed to get ${request.body.user ? "user" : "branch"}`,
    });
  }
};
