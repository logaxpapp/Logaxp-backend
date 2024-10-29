import { CLIENT_URL, ENVIRONMENT } from "@/config";
import ApiError from "@/config/apiError";
import IUserModel, { User } from "@/model/user.model";
import TokenGenerator from "@/util/token-generator";
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
      const { password, email } = req.body;
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
        ...req.body,
        email: req.body.email.toLowerCase(),
      });

      user.setPassword(password);
      user.setVerificationCode(4);
      await user.save();
      user.sendVerificationEmail();
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
      if(!token || !newPassword) throw new ApiError(httpStatus.BAD_REQUEST, !token ? 'Token is required' : "New password is required")
      const { email, expiresIn } = await new TokenGenerator().decrypt(token);
      if (new Date(expiresIn!).getTime() < new Date().getTime()) {
        throw new ApiError(httpStatus.BAD_REQUEST,'Token expired')
      }
      const user: IUserModel = await User.findOne({ email });
      if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "Email not found");
      await user.setPassword(newPassword)
      await user.save()
      res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  };
}
