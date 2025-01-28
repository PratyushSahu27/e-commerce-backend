import { Users } from "../DB/models/models";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { SECRET_KEYWORD } from "../utils/router.utils";

export const userLogin = async (req: Request, res: Response) => {
  console.log("Login");
  let success = false;

  const { smId, password } = req.body;
  let user = await Users.findOne({ smId: smId });
  if (user) {
    const passCompare = password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.smId,
          isActive: user.isActive,
        },
      };
      success = true;
      console.log(user.id);
      const token = jwt.sign(data, SECRET_KEYWORD);
      res.json({ success, token, user });
    } else {
      return res.status(400).json({
        success: success,
        errors: "Invalid password. Please try again.",
      });
    }
  } else {
    return res.status(400).json({
      success: success,
      errors: "User not found. Please try with valid SM ID.",
    });
  }
};
