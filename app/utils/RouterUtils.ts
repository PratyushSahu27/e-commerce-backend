import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";

// MiddleWare to fetch user from database
export const fetchUser = async (request: Request, response: Response, next) => {
  const token = request.header("auth-token");
  if (!token) {
    response
      .status(401)
      .send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token as string, "secret_ecom") as JwtPayload;
    request.body.user = data.user;
    next();
  } catch (error) {
    response
      .status(401)
      .send({ errors: "Please authenticate using a valid token" });
  }
};
