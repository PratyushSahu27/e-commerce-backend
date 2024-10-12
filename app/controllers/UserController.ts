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

export const changeUserActiveStatus = async (
  request: Request,
  response: Response
) => {
  try {
    const { smId, isActive } = request.body;
    await Users.findOneAndUpdate({ smId: smId }, { isActive: isActive });
    response.json({ success: true });
  } catch (error) {
    response.json({ success: false, error });
  }
};
