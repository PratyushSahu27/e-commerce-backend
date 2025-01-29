import { smIdGenerator } from "./../utils/registration.utils.js";
import { Request, Response } from "express";
import { Users } from "../DB/models/models.js";
import { SECRET_KEYWORD } from "../utils/router.utils.js";
import jwt from "jsonwebtoken";

export const signUp = async (request: Request, response: Response) => {
  console.log("Sign Up");
  try {
    let success = false;
    let check = await Users.findOne({ phoneNumber: request.body.phoneNumber });
    if (check) {
      return response.status(400).json({
        success: success,
        errors: "Existing user found with this Phone number",
      });
    }

    const user1 = await Users.findOne({ smId: request.body.guideId });
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
    const newSmId = smIdGenerator(request.body.state, newSerialNumber);

    // Initializing cart
    let cart: { [key: number]: number } = {};
    for (let i: number = 0; i < 1000; i++) {
      cart[i] = 0;
    }

    // Creating the user
    const user = new Users({
      serialNumber: newSerialNumber,
      smId: newSmId,
      guideId: request.body.guideId,
      name: request.body.fullName,
      phoneNumber: request.body.phoneNumber,
      email: request.body.email,
      password: request.body.password,
      addresses: [
        {
          state: request.body.state,
          city: request.body.city,
          address: request.body.address,
          pincode: request.body.pincode,
        },
      ],
      cartData: cart,
      guideSide: request.body.guideSide,
    });

    await user.save();
    const data = {
      user: {
        id: user.smId,
      },
    };

    const token = jwt.sign(data, SECRET_KEYWORD);
    success = true;
    response.json({ success, token, newSmId });
  } catch {
    return response.status(400).json({
      success: false,
      errors: `Failed to get register`,
    });
  }
};
