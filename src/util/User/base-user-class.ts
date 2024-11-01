import IUserModel, { IUser, User } from "@/model/user.model";
import BaseUserManagementServiceInterface from "./base-user-interface";
import ApiError from "@/config/apiError";
import httpStatus from "http-status";

export default class BaseUserManagementServiceClass
  implements BaseUserManagementServiceInterface
{
  async createUser(data: IUser): Promise<IUserModel> {
    try {
      const { password, email } = data;
      if (!password || !email || password.length < 8)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          !password || password.length < 8
            ? "Password must be 8 character or more"
            : "Email is required"
        );

      if (await User.findOne({ email }))
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already exist");

      const user: IUserModel = new User({
        ...data,
        email: data.email.toLowerCase(),
      });

      user.setPassword(password);
      return await user.save();
    } catch (error) {
      throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.message);
    }
  }
}
