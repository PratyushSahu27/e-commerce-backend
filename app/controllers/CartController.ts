import { Request, Response } from "express";
import { Users } from "../DB/models/models.js";

export const getCart = async (request: Request, response: Response) => {
  console.log("Get Cart");
  try {
    let userData = await Users.findOne({ smId: request.body.user.id });
    response.json(userData ? userData.cartData : userData);
  } catch (error: any) {
    console.log("Could not fetch cart items, ", error);
    return response.status(400).json({
      success: false,
      errors: "Failed to get cart",
    });
  }
};

export const setCart = async (request: Request, response: Response) => {
  console.log("setting cart");
  try {
    const user = await Users.findOneAndUpdate(
      { smId: request.body.smId },
      { cartData: request.body.cartItems }
    );
    console.log(user);
    response.send({ success: true });
  } catch (error: any) {
    console.log("Could not fetch cart items, ", error);
    return response.status(400).json({
      success: false,
      errors: "Failed to set cart",
    });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  console.log("Add Cart");
  let userData = await Users.findOne({ smId: req.body.user.id });
  if (userData) {
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate(
      { smId: req.body.user.id },
      { cartData: userData.cartData }
    );
  }
  res.send({ success: true });
};

export const addAllToCart = async (request: Request, response: Response) => {
  console.log("Add all to cart");
  try {
    let userData = await Users.findOne({ smId: request.body.user.id });
    if (userData) {
      Object.keys(request.body.cartItems).forEach((itemId) => {
        if (request.body.cartItems[itemId] > 0) {
          userData.cartData[itemId] += request.body.cartItems[itemId];
        }
      });
      await Users.findOneAndUpdate(
        { smId: request.body.user.id },
        { cartData: userData.cartData }
      );
    }
    response.send({ success: true });
  } catch (error: any) {
    console.log("Could not fetch cart items, ", error);
    return response.status(400).json({
      success: false,
      errors: "Failed to add all to cart",
    });
  }
};

export const removeFromCart = async (request: Request, response: Response) => {
  console.log("Remove Cart");
  try {
    let userData = await Users.findOne({ smId: request.body.user.id });
    if (userData) {
      if (userData.cartData[request.body.itemId] != 0) {
        userData.cartData[request.body.itemId] -= 1;
      }
      await Users.findOneAndUpdate(
        { smId: request.body.user.id },
        { cartData: userData.cartData }
      );
    }
    response.send({ success: true });
  } catch (error: any) {
    console.log("Could not fetch cart items, ", error);
    return response.status(400).json({
      success: false,
      errors: "Failed to add all to cart",
    });
  }
};

export const removeAllQuantityOfItemFromCart = async (
  request: Request,
  response: Response
) => {
  try {
    let userData = await Users.findOne({ smId: request.body.user.id });
    if (userData) {
      if (userData.cartData[request.body.itemId] != 0) {
        userData.cartData[request.body.itemId] = 0;
      }
      await Users.findOneAndUpdate(
        { smId: request.body.user.id },
        { cartData: userData.cartData }
      );
    }
    response.send({ success: true });
  } catch (error: any) {
    console.log("Could not fetch cart items, ", error);
    return response.status(400).json({
      success: false,
      errors: "Failed to remove all from cart",
    });
  }
};
