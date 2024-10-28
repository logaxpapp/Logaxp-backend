import { ENVIRONMENT } from "@/config";
import ApiError from "@/config/apiError";
import IUserModel, { User } from "@/model/user.model";
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
      if (!password || !email)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          !password ? "Password is required" : "Email is required"
        );

      if (await User.findOne({ email }))
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already exist");

      const user: IUserModel = new User({
        ...req.body,
        email: req.body.email.toLowerCase(),
      });

      user.setCustomerRef(6);
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
        email: email.toLowerCase(),
        email_verification_code: otp,
      });
      if (!user || !otp)
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
      res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        message: "Account Created Successfully",
        data: user.toAuthIndividualJSON(),
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
      if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Email");
      if (!user.validPassword(password))
        res
          .status(httpStatus.BAD_REQUEST)
          .json({ code: httpStatus.BAD_REQUEST, message: "Invalid details" });
      const token = await user.generateIndividualJWT();
      res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        message: "Logged In Successfully",
        data: user.toAuthIndividualJSON(),
      });
    } catch (error) {
      next(error);
    }
  };
}
