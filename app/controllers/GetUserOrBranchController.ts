import { Request, Response } from "express";
import { Branch, Users } from "../DB/models/Models.js";

export const getUserOrBranch = async (request: Request, response: Response) => {
  console.log("Get user or branch");
  if (request.body.user) {
    let userData = await Users.findOne({ smId: request.body.user.id });
    response.json({ userData, state: "User" });
  } else if (request.body.branch) {
    let userData = await Branch.findOne({
      branch_id: request.body.branch.branch_id,
    });
    response.json({ userData, state: "Branch" });
  }
};
