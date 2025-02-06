import { IUser, USER_SCHEMA } from "./../DB/models/user.model";
import { smIdGenerator } from "./../utils/registration.utils.js";
import { Request, Response } from "express";
import { Users } from "../DB/models/models.js";
import { SECRET_KEYWORD } from "../utils/router.utils.js";
import jwt from "jsonwebtoken";
import { GuideSideEnum } from "../utils/user.util.js";

export const signUp = async (request: Request, response: Response) => {
  console.log("Sign Up");
  const {
    phoneNumber,
    guideId,
    state,
    fullName,
    email,
    password,
    city,
    address,
    pincode,
    guideSide,
  } = request.body;
  try {
    let success = false;
    let check = await Users.findOne({ phoneNumber });
    if (check) {
      return response.status(400).json({
        success: success,
        errors: "Existing user found with this Phone number",
      });
    }

    const user1 = await Users.findOne({ smId: guideId });
    if (!user1) {
      return response.status(400).json({
        success: success,
        errors: "Guide ID is invalid",
      });
    }

    if (!user1.isActive) {
      return response.status(400).json({
        success: success,
        errors: "Guide ID is inactive",
      });
    }

    // Generating new serial number
    let newSerialNumber = 0;

    if ((await Users.find().countDocuments()) > 0) {
      let lastSn = 0;
      await Users.findOne()
        .sort({ serialNumber: -1 })
        .limit(1)
        .then((latestEntry) => {
          if (latestEntry) {
            lastSn = latestEntry.serialNumber as number;
            console.log("Value:", lastSn);
          } else {
            console.log("No documents found");
          }
        })
        .catch((err: Error) => {
          console.log(err);
        });
      newSerialNumber = 1 + lastSn;
    }

    // Generating SM ID
    const newSmId = smIdGenerator(state, newSerialNumber);

    const parentId = await getParentId(newSmId, guideId, guideSide);

    // Initializing cart
    let cart: { [key: number]: number } = {};
    for (let i: number = 0; i < 1000; i++) {
      cart[i] = 0;
    }

    // Creating the user
    const user = new Users({
      serialNumber: newSerialNumber,
      smId: newSmId,
      guideId: guideId,
      name: fullName,
      phoneNumber: phoneNumber,
      email: email,
      password: password,
      addresses: [
        {
          name: fullName,
          phoneNumber: phoneNumber,
          state: state,
          city: city,
          address: address,
          pincode: pincode,
        },
      ],
      cartData: cart,
      guideSide: guideSide,
      parentId,
      leftChild: "",
      rightChild: "",
    });

    await user.save();
    const data = {
      user: {
        id: user.smId,
      },
    };

    const token = jwt.sign(data, SECRET_KEYWORD);
    success = true;
    response.json({
      success,
      token,
      smId: newSmId,
      password,
      parentId,
      guideId,
      name: fullName,
    });
  } catch (e) {
    return response.status(400).json({
      success: false,
      errors: `Failed to register: ${e}`,
    });
  }
};

async function getParentId(smId: string, guideId: string, side: GuideSideEnum) {
  try {
    let isSideEmpty = false,
      currentParentId = guideId;
    const key = `${side}Child`;

    while (!isSideEmpty) {
      const user: IUser | null = await Users.findOne({ smId: currentParentId });

      if (!user) {
        return null;
      }

      if (!user[key]) {
        await Users.findOneAndUpdate(
          { smId: currentParentId },
          { [key]: smId }
        );
        isSideEmpty = true;
      } else {
        currentParentId = user[key];
      }
    }

    return currentParentId;
  } catch (e) {
    console.log("Error in getting parent ID during registration: ", e);
  }
}
