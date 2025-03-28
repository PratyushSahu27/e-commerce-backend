import { Request, Response } from "express";
import { Users } from "../DB/models/models.js";
import { buildBinaryTree, fetchUserBySmId } from "../utils/user.util.js";
import { IUser } from "../DB/models/user.model.js";

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

export const getDirectJoinees = async (
  request: Request,
  response: Response
) => {
  let directJoinees;
  try {
    directJoinees = await Users.find(
      { guideId: request.body.user.smId },
      { _id: 0, smId: 1, name: 1, guideId: 1, phoneNumber: 1 }
    );
    response.send({ directJoinees });
  } catch (e) {
    console.log("Unable to get direct joinees: ", e);
    response.send({ successful: false });
  }
};

export const addAddress = async (request: Request, response: Response) => {
  try {
    Users.findOneAndUpdate(
      { _id: request.body.user.id },
      {
        $push: {
          addresses: {
            address: request.body.user.address,
            city: request.body.user.city,
            state: request.body.user.state,
            pincode: request.body.user.pincode,
          },
        },
      }
    );
    response.send({ success: true });
  } catch (e) {
    console.log("Unable to add address", e);
    response.send({ successful: false });
  }
};

export const getUserTree = async (req: Request, res: Response) => {
  try {
    const { smId } = req.body;
    if (!smId) return res.status(400).json({ error: "smId is required" });

    const user = await fetchUserBySmId(smId);

    const tree = await buildBinaryTree(smId);
    if (!tree) return res.status(404).json({ error: "User not found" });

    res.json({ parent: user?.parentId, tree });
  } catch (error) {
    console.error("Error building tree:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const changeUserPassword = async (req: Request, res: Response) => {
  try {
    const { smId, oldPassword, newPassword} = req.body;
    const user: IUser | null = await fetchUserBySmId(smId);

    if(!user) {
      res.json({success: false, error: "User not found."});
      return;
    }

    if(user.password === oldPassword) {
      await Users.findOneAndUpdate({smId: smId}, {password: newPassword});
    } else {
      res.json({success: false, message: "Passsword reset failed! Old passowrd is wrong."});
    }
    res.json({success: true, message: "Password reset success."});
  } catch (error) {
    console.error("Error resetting password for user: ", req.body.smId ," - ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
