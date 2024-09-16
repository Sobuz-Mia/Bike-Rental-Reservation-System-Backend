import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../error/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { User } from "../modules/User/user.model";
import { TUserRole } from "../modules/User/user.interface";

const auth = (...requiredRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;
    // checking the token is send from client
    if (!accessToken) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route"
      );
    }
    // split token
    const [, token] = accessToken.split(" ");
    // checking the token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_token_secret as string
    ) as JwtPayload;
    const { email, role } = decoded;
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "This User not found");
    }
    // checking role
    if (requiredRole && !requiredRole.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route"
      );
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
