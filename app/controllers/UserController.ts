import { Request, Response } from "express";
import { Users } from "../DB/models/Models.js";

export const getUser = async (request: Request, response: Response) => {
  try {
    const { smId } = request.body;
    const user = await Users.findOne({ smId: smId });
    if (user) {
      response.json({ success: true, user });
    } else {
      response.json({ success: false, error: "User not found" });
    }
  } catch (error) {
    console.log("Error fetching user: ", error);
    response.json({ success: false, error });
  }
};
