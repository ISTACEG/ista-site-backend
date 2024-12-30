const NodeCache = require("node-cache");
const nodemailer = require("nodemailer");

const otpCache = new NodeCache({ stdTTL: 360 });

const senderEmail = process.env.EMAIL;
const senderPassword = process.env.PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: senderEmail,
    pass: senderPassword,
  },
});

const generateOtp = (roll) => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  otpCache.set(roll, otp);
  return otp;
};

const sendOtpMail = (student_email, otp) => {
  const mailOptions = {
    from: senderEmail,
    to: student_email,
    subject: "ISTA OTP Verification",
    text: `Here is your OTP code: ${otp}`,
    html: `
    <div style="font-family: Arial, sans-serif; color: #ffffff; background-color: #1a1a1a; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
        <h2 style="text-align: center; color: #ffd700; margin-bottom: 20px;">WELCOME TO ISTA!</h2>
        <p style="font-size: 16px; color: #ffffff;">Hey there,</p>
        <p style="font-size: 16px; color: #ffffff;">Thanks for signing up for ISTA! Use the OTP below to complete your registration:</p>
        <h3 style="text-align: center; background-color: #333333; color: #ffd700; padding: 10px 20px; border-radius: 5px; display: inline-block; border: 1px solid #ffd700;">${otp}</h3>
        <p style="font-size: 16px; color: #ffffff; margin-top: 20px;">Enter this OTP in the registration page</p>

        <hr style="border: 0; border-top: 1px solid #ffd700; margin: 20px 0;">
        <p style="font-size: 12px; color: #ffd700; text-align: center;">Let's grow together</p>
      </div>
    `,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

const sendForgotOtpMail = (student_email, otp) => {
  const mailOptions = {
    from: senderEmail,
    to: student_email,
    subject: "ISTA OTP Verification",
    text: `Here is your OTP code: ${otp}`,
    html: `
 <div style="font-family: Arial, sans-serif; color: #ffffff; background-color: #1a1a1a; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
        <h2 style="text-align: center; color: #ffd700; margin-bottom: 20px;">ISTA Password Reset</h2>
        <p style="font-size: 16px; color: #ffffff;">Hello,</p>
        <p style="font-size: 16px; color: #ffffff;">We received a request to reset your password. Use the OTP below to reset your password:</p>
        <h3 style="text-align: center; background-color: #333333; color: #ffd700; padding: 10px 20px; border-radius: 5px; display: inline-block; border: 1px solid #ffd700;">${otp}</h3>
        <p style="font-size: 16px; color: #ffffff; margin-top: 20px;">Enter this OTP in the password reset page.</p>
        <p style="font-size: 16px; color: #ffffff;">If you did not request a password reset, please ignore this email.</p>

        <hr style="border: 0; border-top: 1px solid #ffd700; margin: 20px 0;">
        <p style="font-size: 12px; color: #ffd700; text-align: center;">Thank you, ISTA Web Team</p>
      </div>
    `,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

module.exports = {
  generateOtp,
  sendOtpMail,
  sendForgotOtpMail,
  otpCache,
};
