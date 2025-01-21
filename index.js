const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const router = require("./app/module/route/route");

dotenv.config();
const port = process.env.port || 5000;

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(passport.initialize());
app.use(passport.session());


let { DB_USER, DB_PASS } = process.env;
let url = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.nhg2oh1.mongodb.net/storage?retryWrites=true&w=majority&appName=Cluster0`;

const database = "storage";
mongoose
  .connect(url, { dbName: database })
  .then(() => {
    console.log("Connected to database!");
})
  .catch((error) => {
    console.log("Connection failed!", error);
    process.exit();
});

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Project is running!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});