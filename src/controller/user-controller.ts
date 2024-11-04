import { breakPoint, CLIENT_URL, ENVIRONMENT } from "@/config";
import ApiError from "@/config/apiError";
import IUserModel, { IUser, User } from "@/model/user.model";
import TokenGenerator from "@/util/token-generator";
import BaseUserManagementServiceClass from "@/util/User/base-user-class";
import httpStatus from "http-status";

export class UserController {
  /**
   *
   * @param req  THis class is all about the user auth contoller
   * @param res
   * @param next
   */

  //register as a user
  createUser = async (req: any, res: any, next: any) => {
    try {
      const user: IUserModel =
        await new BaseUserManagementServiceClass().createUser(req.body);
      user.setVerificationCode(4);
      user.sendVerificationEmail();
      await user.save()
      res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        message: "Enter OTP",
      });
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: any, res: any, next: any) => {
    try {
      const { otp, email } = req.body;
      const user: IUserModel = await User.findOne({
        email: email?.toLowerCase(),
        email_verification_code: otp,
      });
      if (!user || !otp)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          !otp ? "Invalid OTP" : "Invalid details"
        );
      user.is_email_verified = true;
      await user.save();
      const data = await user.toAuthIndividualJSON();
      res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        message: "Account Created Successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  //login  as a user
  login = async (req: any, res: any, next: any) => {
    try {
      const { email, password } = req.body;
      const user: IUserModel = await User.findOne({ email });
      if (!user || !password)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          !user ? "Invalid Email" : "Password is required"
        );
      if (!user.validPassword(password))
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid details");
      const data = await user.toAuthIndividualJSON();
      res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        message: "Logged In Successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  //Request Password link
  resetPassword = async (req: any, res: any, next: any) => {
    try {
      const { email } = req.body;
      const user: IUserModel = await User.findOne({ email });
      if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "Email not found");
      const token = await new TokenGenerator().generate({
        name: user.name,
        email: user.email,
      });
      await user.sendPasswordResetLink(
        `${CLIENT_URL}/reset-password?token=${token}`
      );
      res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        message: "Email sent",
      });
    } catch (error) {
      next(error);
    }
  };

  //Update password
  updatePassword = async (req: any, res: any, next: any) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          !token ? "Token is required" : "New password is required"
        );
      const { email, expiresIn } = await new TokenGenerator().decrypt(token);
      if (new Date(expiresIn!).getTime() < new Date().getTime()) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Token expired");
      }
      const user: IUserModel = await User.findOne({ email });
      if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "Email not found");
      await user.setPassword(newPassword);
      await user.save();
      res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  };

  //get user profile
  getProfile = async (req: any, res: any, next: any) => {
    try {
      const user: any = await User.findById(req.user._id);
      res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        message: "success",
        data: { ...user._doc, password_hash: undefined },
      });
    } catch (error) {
      next(error);
    }
  };

  //update profile
  updateProfile = async (req: any, res: any, next: any) => {
    try {
      if (req.body.password)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Updating password is not allowed here"
        );

      if (req.body.email) {
        if (await User.findOne({ email: req.body.email }))
          throw new ApiError(httpStatus.BAD_REQUEST, "Email already exist");
      }
      await User.findByIdAndUpdate(req.user._id, { ...req.body }),
        res.status(httpStatus.OK).json({
          status: httpStatus.OK,
          message: "success",
        });
    } catch (error) {
      next(error);
    }
  };

  //update in app password
  updateInAppPassword = async (req: any, res: any, next: any) => {
    try {
      const { password } = req.body;
      const user = await User.findById(req.user._id);
      user.setPassword(password);
      await user.save();
      res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  };

  //request account deletion
  requestAccountDeletion = async (req: any, res: any, next: any) => {
    try {
      const user = await User.findById(req.user._id);
      user.delete_request = true;
      await user.save();
      const admin = await User.findOne({ role: "admin" });
      user.sendAccountDeleteRequest(admin.email);
      res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  };
}
