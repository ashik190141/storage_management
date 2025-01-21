const express = require("express");
const passport = require("passport");
const { jwtSecret, jwtExpire } = require("../../config");
const jwt = require("jsonwebtoken");
const { createUser, userLogin, forgetPassword, checkOtpFromUser, resetPasswordIntoDb } = require("./auth.controller");

const authRouter = express.Router();

authRouter.post("/register", createUser);
authRouter.post("/login", userLogin);
authRouter.post("/forgetPassword", forgetPassword);
authRouter.post("/otp", checkOtpFromUser);
authRouter.put("/reset", resetPasswordIntoDb);
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/api/v1/auth/success");
  }
);
authRouter.get("/success", (req, res) => {
    console.log(req.user);
    const token = jwt.sign({ email: req.user.email }, jwtSecret, {
      expiresIn: jwtExpire,
    });
  res.send(`Token=${token}`);
});

module.exports = authRouter;
