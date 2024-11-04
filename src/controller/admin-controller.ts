import ApiError from "@/config/apiError";
import { IUser, User } from "@/model/user.model";
import BaseUserManagementServiceClass from "@/util/User/base-user-class";
import { NextFunction } from "express";
import httpStatus from "http-status";
import { Schema } from "inspector/promises";

export class AdminController {
  createEmployee = async (req: any, res: any, next: NextFunction) => {
    try {
      const user = await new BaseUserManagementServiceClass().createUser(
        req.body
      );
      user.sendWelcomeEmail(user.email, req.body.password, user.name);
      res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  };

  approveRequest = async (req: any, res: any, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id)
      if(!user) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user")
      user.sendAccountApprovalRequest()
      await User.findByIdAndUpdate(id, { delete_request: false , is_deleted: true})
      res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  };

  rejectRequest = async (req: any, res: any, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id)
      if(!user) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user")
      user.sendAccountRejectionRequest()
      await User.findByIdAndUpdate(id, { delete_request: false , is_deleted: false}),
      res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  };

  getRequests = async (req: any, res: any, next: NextFunction) => {
    try {
        const data: {name: string, email: string, _id: string} [] = []
        const users: IUser[] = await User.find({ delete_request: true })
        users.map(async(user:any)=>{
             data.push({_id: user._id, name: user.name, email: user.email})
        })
      res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        message: "success",
        data
      });
    } catch (error) {
      next(error);
    }
  }; 
}
