const myModel = require("./auth.model");
const userModel = require("../auth/auth.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  jwtExpire,
  jwtSecret,
  forgetPasswordSecret,
  forgetPasswordSecretExpire,
} = require("../../config");
const { emailSender } = require("../../shared/emailSend");

const addUserIntoDB = async (req) => {
  const { name, email, password } = req;
  try {
    const existingUser = await myModel.findOne({ email });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userInfo = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new myModel(userInfo);
    await newUser.save();

    const token = jwt.sign({ email: userInfo.email }, jwtSecret, {
      expiresIn: jwtExpire,
    });

    return token;
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req;
  try {
    const user = await myModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid email");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ email: email }, jwtSecret, {
      expiresIn: jwtExpire,
    });

    return token;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to login");
  }
};

const forgetPasswordServices = async (email) => {
  const userInfo = await userModel.findOne({ email });
  if (!userInfo) {
    throw new Error("user not found");
  }

  let otp = Math.floor(100000 + Math.random() * 900000);

  const token = jwt.sign({ email: email, otp: otp }, forgetPasswordSecret, {
    expiresIn: forgetPasswordSecretExpire,
  });

  const emailSend = await emailSender(
    email,
    "Forget Password OTP",
    `
      <div>
        <p>Dear, ${userInfo?.name}</p>
        <p>Your OTP : ${otp}</p>
      </div>
    `
  );

  if (!emailSend) {
    throw new Error("Email do not send");
  }

  return token;
};

const checkOtp = async (otp, token) => {
  try {
    if (!token) {
      throw new Error("you are not authorized");
    }

    // console.log(token);

    const decoded = jwt.verify(token, forgetPasswordSecret);
    // console.log(otp,decoded);
    const cookiesOtp = decoded.otp;

    if (parseInt(otp) !== cookiesOtp) {
      throw new Error("OTP do not matched");
    }

    return "matched the otp";
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const resendEmail = async (token) => {
  try {
    if (!token) {
      throw new Error("you are not authorized");
    }

    const decoded = jwt.verify(token, forgetPasswordSecret);
    // console.log(otp,decoded);
    const cookiesEmail = decoded.email;

    const resendEmail = await forgetPasswordServices(cookiesEmail);

    return resendEmail

  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const resetPassword = async (token, payload) => {
  try {
    const { password } = payload;
    
    if (!token) {
      throw new Error("you are not authorized");
    }

    const decoded = jwt.verify(token, forgetPasswordSecret);
    const cookiesEmail = decoded.email;

    const hashedPassword = await bcrypt.hash(password, 12);

    const update = { $set: { password: hashedPassword } };
    const query = {email:cookiesEmail}
    const updatedPass = await userModel.findOneAndUpdate(query, update);

    if (!updatedPass) {
      throw new Error("Do not update password");
    }

    return 'Update Password Successfully'

  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
}

module.exports = {
  addUserIntoDB,
  loginUser,
  forgetPasswordServices,
  checkOtp,
  resendEmail,
  resetPassword,
};
