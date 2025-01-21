const catchAsync = require("../../shared/catchAsync");
const sendResponse = require("../../shared/sendResponse");
const { addUserIntoDB, loginUser, forgetPasswordServices, checkOtp, resendEmail, resetPassword } = require("./auth.service");

const createUser = catchAsync(async (req, res) => {
  const result = await addUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Create User Successfully`,
    data: result,
  });
});

const userLogin = catchAsync(async (req, res) => {
  const result = await loginUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Login Successfully`,
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const result = await forgetPasswordServices(req.body.email);
  
  res.cookie("token", result, {
    httpOnly: true,
    secure: false,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'check your email',
    data: null,
  });
});

const checkOtpFromUser = catchAsync(async (req, res) => {
  const token = req.cookies.token;
  const result = await checkOtp(req.body.otp,token);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result,
    data: null,
  });
});

const resend = catchAsync(async (req, res) => {
  const token = req.cookies.token;
  const result = await resendEmail(token);

  res.cookie("token", result, {
    httpOnly: true,
    secure: false,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "check your email",
    data: null,
  });
});

const resetPasswordIntoDb = catchAsync(async (req, res) => {
  const token = req.cookies.token;
  const result = await resetPassword(token, req.body);
  res.clearCookie("token");
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result,
    data: null,
  });
});

module.exports = {
  createUser,
  userLogin,
  forgetPassword,
  checkOtpFromUser,
  resend,
  resetPasswordIntoDb,
};