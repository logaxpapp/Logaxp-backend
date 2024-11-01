import IUserModel, { IUser } from "@/model/user.model";

export default interface  BaseUserManagementServiceInterface{
    createUser (data: IUser, sendWelcomeMail?: boolean): Promise<IUserModel>
}