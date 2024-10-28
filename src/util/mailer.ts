import axios from 'axios'
import { SENDGRID_API_KEY, SENDGRID_FROM} from '@/config'
import ApiError from '@/config/apiError';
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);
import httpStatus from 'http-status'


const sendEmail = async (receiver:string, subject:string, body:string) => {
  try {
  const from = SENDGRID_FROM

  const options = {
    from: from,
    to: receiver,
    Subject: subject,
    html: body,
  }

   const sendMail = await sgMail.send(options);

   return sendMail
  }
  catch (error) {
    console.log(error.response.body.errors)
    console.log(SENDGRID_API_KEY)
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.message)
  }
 
}

export default sendEmail

  // Headers: headers,