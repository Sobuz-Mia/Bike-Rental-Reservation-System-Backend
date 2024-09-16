import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TUser } from "../User/user.interface";
import { User } from "../User/user.model";
import jwt from "jsonwebtoken";
import config from "../../config";
import { TUserLogin } from "./auth.interface";

const createUserIntoDB = async (payload: TUser) => {
  const isUserExist = await User.findOne({ email: payload.email });
  if (isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "This user already exist");
  }
  const result = await User.create(payload);
  return result;
};
const loginUser = async (payload: TUserLogin) => {
  const user = await User.findOne({ email: payload.email }).select(
    "+password -createdAt -updatedAt"
  );
  // checking is user exist
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user not found");
  }
  // checking password is correct
  if (!(await User.isPasswordMatch(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is incorrect");
  }
  const userData = {
    _id: user?._id,
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    address: user?.address,
    role: user?.role,
  };
  // create token and send to the client
  const jwtPayload = {
    email: user?.email,
    role: user?.role,
    userId: user?._id,
  };
  const accessToken = jwt.sign(
    jwtPayload,
    config.jwt_access_token_secret as string,
    { expiresIn: "10d" }
  );
  // const result = await User.create(payload);
  return {
    accessToken: `Bearer ${accessToken}`,
    userData,
  };
};

export const AuthServices = {
  createUserIntoDB,
  loginUser,
};
