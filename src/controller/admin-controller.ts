import { User } from "@/model/user.model";
import BaseUserManagementServiceClass from "@/util/User/base-user-class";
import { NextFunction } from "express";
import httpStatus from "http-status";

export class AdminController {
  createEmployee = async (req: any, res: any, next: NextFunction) => {
    try {
      const user = await new BaseUserManagementServiceClass().createUser(
        req.body
      );
      user.sendWelcomeEmail(user.email, req.body.password, user.name);
      res.status(httpStatus).json({
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
      res.status(httpStatus).json({
        status: httpStatus.OK,
        message: "success",
        data: await User.findByIdAndUpdate(id, { delete_request: false , is_deleted: true}),
      });
    } catch (error) {
      next(error);
    }
  };

  rejectRequest = async (req: any, res: any, next: NextFunction) => {
    try {
      const { id } = req.params;
      res.status(httpStatus).json({
        status: httpStatus.OK,
        message: "success",
        data: await User.findByIdAndUpdate(id, { delete_request: false , is_deleted: false}),
      });
    } catch (error) {
      next(error);
    }
  };

  getRequests = async (req: any, res: any, next: NextFunction) => {
    try {
      res.status(httpStatus).json({
        status: httpStatus.OK,
        message: "success",
        data: await User.find({delete_request: true}),
      });
    } catch (error) {
      next(error);
    }
  }; 
}
