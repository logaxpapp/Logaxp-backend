import { Schema, Document, model } from "mongoose";
import crypto from "crypto";
import { JWT_EXPIRE, JWT_SECRET, POSTMARK_MAIL_FROM } from "@/config";
import uniqueValidator from "mongoose-unique-validator";
import { customAlphabet } from "nanoid";
import sendMail from "@/util/mailer";
import { seal } from "../config/jwt";
// import { encrypt } from "@/utils/helper";

export interface IUser {
  name: string;
  email: string;
  password_hash: string;
  role: string;
  email_verification_code: string;
  application_managed: string;
  job_title: string;
  status: string;
}

export interface IUserToAuthJSON {
  name: string;
  email: string;
  password_hash: string;
  role: string;
  email_verification_code: string;
  application_managed: string;
  job_title: string;
  status: string;
}

export default interface IUserModel extends Document, IUser {
  generateIndividualJWT(): any;
  sendPasswordResetLink(): void;
  sendVerificationEmail(): void;
  sendWelcomeEmail(password: any): void;
  sendTWOFACode(): void;
  setStaffRef(strength: number): void;
  setCustomerRef(strength: number): void;
  setVerificationCode(strength: number): void;
  setTWOFACode(strength: number): void;
  setPassword(password: string): void;
  validPassword(password: string): boolean;
  toAuthIndividualJSON(): IUserToAuthJSON;
}

const schema = new Schema<IUserModel>(
  {
    name: { type: String, default: null, required: true },
    email: { type: String, default: null, required: true },
    email_verification_code: { type: String, default: null, required: true },
    password_hash: { type: String, default: null, required: true },
    role: { type: String, default: null, required: true },
    application_managed: { type: String, default: null, required: true },
    job_title: { type: String, default: null, required: true },
    status: { type: String, default: null, required: true },
  },
  { timestamps: true }
);

// Plugins
schema.plugin(uniqueValidator);

schema.methods.setPassword = function (password: string) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.password_hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

schema.methods.setVerificationCode = function (strength: number) {
  const nanoid = customAlphabet(
    "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRESTUVWXYZ",
    strength
  );
  this.email_verification_code = nanoid().toUpperCase();
};

schema.methods.validPassword = function (password: string): boolean {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.password === hash;
};

schema.methods.generateIndividualJWT = async function (): Promise<string> {
  const token = await seal(
    {
      _id: this._id,
      role: this.role,
      name:this.name,
      email:this.email,
    },
    JWT_SECRET,
    JWT_EXPIRE
  );

  return token;
};

schema.methods.toAuthIndividualJSON = async function () {
  const {
    _id,
    name,
    email,
    role,
    application_managed,
    job_title,
    status,
  } = this;

  return {
    id: _id,
    name,
    email,
    role,
    application_managed,
    job_title,
    status,
    token: await this.generateIndividualJWT(),
  };
};

schema.methods.sendVerificationEmail = async function () {
  const body = `
  <!DOCTYPE html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="x-apple-disable-message-reformatting" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
        integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      />
      <title>Verify Email</title>
      <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
      <![endif]-->
      <style>
        body,
        div,
        h1,
        p,
        button,
        a {
          font-family: "Poppins", sans-serif;
        }
        i {
          color: rgba(255, 255, 255, 0.9);
        }
        * {
          padding: 0;
          margin: 0;
        }
        p {
          font-size: 1rem;
        }
        @media (max-width: 500px) {
          p {
            font-size: 0.875rem;
          }
        }
        button:hover,
        a:hover {
          opacity: 0.75;
        }
        .main-container {
          padding: 1.5rem;
          margin: 1.5rem auto 0;
          max-width: 700px;
          width: 100%;
          background-color: white;
        }
        @media (max-width: 900px) {
          .main-container {
            width: 80%;
          }
        }
        @media (max-width: 500px) {
          .main-container {
            padding: 1rem;
          }
        }
        .page-header {
          color: rgba(0, 0, 0, 0.9);
          font-weight: 600;
          font-size: 1.5rem;
        }
        @media (max-width: 500px) {
          .page-header {
            font-size: 1.25rem;
          }
        }
        .page-text {
          color: rgba(0, 0, 0, 0.7);
          font-weight: 400;
        }
        .btn-container {
          margin: 2rem auto;
          max-width: 300px;
          width: 100%;
        }
        @media (max-width: 500px) {
          .btn-container {
            margin: 1.25rem auto;
          }
        }
        .social-container {
          background-color: #5cb23a;
          padding: 1rem 1.5rem;
          margin-top: 1.5rem;
          border-radius: 4px;
        }
        @media (max-width: 500px) {
          .social-container {
            padding: 1rem;
            margin-top: 1.25rem;
          }
        }
        .tax-text {
          text-align: center;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          width: 80%;
          margin: auto;
        }
        @media (max-width: 500px) {
          .tax-text {
            width: 100%;
          }
        }
        .social-flex {
          margin-top: 2rem;
          display: flex;
          gap: 2rem;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 500px) {
          .social-flex {
            margin-top: 1.25rem;
          }
        }
        .social-link {
          font-size: 1.5rem;
        }
        .footer-link {
          font-size: 1rem;
          color: rgba(0, 0, 0, 0.5);
          text-decoration: none;
        }
        @media (max-width: 500px) {
          .footer-link {
            font-size: 0.875rem;
          }
        }
        .mail-text {
          width: 80%;
          margin: 1rem auto;
          text-align: center;
        }
        @media (max-width: 500px) {
          .mail-text {
            width: 100%;
          }
        }
      </style>
    </head>
    <body style="margin: 2rem 0; background-color: #f4f5fb">
      <div style="width: 115px; height: 45px; margin: 0 auto">
        <image
          src=""
          alt=" Logo"
          style="width: 100%; height: 100%"
        />
      </div>
      <div class="main-container">
        <div>
          <h1 class="page-header"> Email Verification</h1>
          <hr style="margin: 12px 0; border: none; border-top: 1px solid rgba(0, 0, 0, 0.1)" />
          <p class="page-text">Dear ${this.first_name}</p>
          <br />
          
          <p class="page-text">
            You are on step away from joining our amazing user base. Please enter the code below to verify your account.
          </p>
        </div>
  
        <div style="margin: 1.5rem 0">
          <p style="color: rgba(0, 0, 0, 0.5); font-size: 12px; text-align: center">ONE-TIME PASSWORD</p>
          <p style="color: rgba(0, 0, 0, 0.9); text-align: center; font-weight: 700; font-size: 2rem; letter-spacing: 1rem;">
            ${this.email_verification_code}
          </p>
        </div>
  
        <div>
          <p class="page-text">
            The verification code will expire after <b>30 minutes</b>. Do not share your code withanyone.
          </p>
          <br />
          <p class="page-text">
            Don’t recognize this activity? Please
            <a href="#" style="color: #5cb23a; font-weight: 600">reset your password</a> and contact
            customer support immediately.
          </p>
          <br />
          <p class="page-text">This is an automated message, please do not reply.</p>
        </div>
  
     
  
        <footer style="margin-top: 2rem; color: rgba(0, 0, 0, 0.5)">
          <div style="display: flex; width: fit-content; margin: 0 auto">
           
          </div>
        </footer>
      </div>
    </body>
  </html>
  `;
  console.log("hello world");
  const data = await sendMail(this.email, "LogoXp Verification", body);
  console.log(data);
  // return Promise.resolve();
};

schema.methods.sendPasswordResetLink = async function () {
  const name = `${this.first_name} ${this.last_name}`;

  const body = "";

  await sendMail(this.email, "Reset Password", body);
  // return Promise.resolve();
};

schema.methods.sendTWOFACode = async function () {
  const name = `${this.first_name} ${this.last_name}`;
  const body = "";

  await sendMail(this.email, "TWO FA CODE", body);
  // return Promise.resolve();
};

//send welcome email
schema.methods.sendWelcomeEmail = async function (password: any) {
  const userName = `${this.first_name} ${this.last_name}`;
  const body = `<h1>Hello ${userName}, Welcome to LogoXP</h1> <p>Your password is ${password}`;

  await sendMail(this.email, "Yaay! Welcome to LogoXP", body);

  return Promise.resolve();
};

export const User = model<IUserModel>("User", schema);
