import { Request, Response } from "express";
import { Users } from "../DB/models/models.js";

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
