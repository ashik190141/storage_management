const dotenv = require("dotenv");
dotenv.config();
const path = require("path");

dotenv.config({ path: path.join(process.cwd(), ".env") });

module.exports = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.EXPIRES_IN,
  email: process.env.EMAIL,
  app_password: process.env.APP_PASSWORD,
  forgetPasswordSecret: process.env.FORGET_PASSWORD_SECRET,
  forgetPasswordSecretExpire: process.env.FORGET_PASSWORD_EXPIRE,
};
