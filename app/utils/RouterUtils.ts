import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";

export const fetchUserOrBranch = async (
  request: Request,
  response: Response,
  next: any
) => {
  const token = request.header("auth-token");
  if (!token) {
    response
      .status(401)
      .send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token as string, "secret_ecom") as JwtPayload;
    if (data.branch) {
      request.body.branch = data.branch;
    } else if (data.user) {
      request.body.user = data.user;
    }
    next();
  } catch (error) {
    response
      .status(401)
      .send({ errors: "Please authenticate using a valid token" });
  }
};
