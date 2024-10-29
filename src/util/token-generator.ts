import { DateTime } from "luxon";
import * as CryptoJS from "crypto-js";
import ApiError from "@/config/apiError";
import httpStatus from "http-status";
export default class TokenGenerator {
  private authenticationSecretKey: string | any = process.env.JWT_SECRET;
  protected expirationTime: Record<string, number> = { minutes: 5 };

  async generate(data: any): Promise<string> {
    const tokenTime = DateTime.now();
    const token = CryptoJS.AES.encrypt(
      JSON.stringify({
        ...data,
        tokenTime,
        expiresIn: tokenTime.plus(this.expirationTime),
      }),
      this.authenticationSecretKey!
    ).toString();
    return token;
  }

  async decrypt(tokenString: string): Promise<any> {
    try {
      const bytes = CryptoJS.AES.decrypt(
        tokenString,
        this.authenticationSecretKey!
      );
      const tokenData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return tokenData;
    } catch (error) {
        throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, "Invalid token")
    }
  }
}
