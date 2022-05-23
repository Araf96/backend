const express = require("express");
const { v4: uuid } = require("uuid");

const { User } = require("../models/user-model");
const CustomError = require("../templates/ErrorTemplate");
const EM = require("../Util/texts");
const { getHashedValue, matchHash } = require("../Util/functions");

const router = express.Router();

// router.get("/", (req, res, next) => {
//   res.json({ message: "get all users" });
// });

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  var message = "";
  try {
    let user = await User.findOne({ email: email });

    if (user) {
      let resPass = await matchHash(password, user.password);

      if (resPass) {
        try {
          token = await user.generateAuthToken();
          res.header("x-auth", token).json(user);
        } catch (e) {
          message = e.message;
        }
      } else {
        message = EM.INV_PASS;
      }
    } else {
      message = EM.USER_N_EXIST;
    }

    return next(new CustomError(message, 500));
  } catch (e) {
    return next(new CustomError(EM.ERR_UNKNOWN, 500));
  }
});

router.post("/signup", async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const signupDate = new Date();

  var newUser = new User({
    firstName,
    lastName,
    email,
    password,
    signupDate,
  });

  try {
    await newUser.save();
  } catch (err) {
    var message = "";
    if (err.name === "ValidationError") {
      var keys = Object.keys(err.errors);

      if (err.errors[keys[0]]) {
        message = err.errors[keys[0]].message;
      } else {
        message = EM.ERR_UNKNOWN;
      }
    } else if (err.code == 11000) {
      var keys = Object.keys(err.keyValue);

      if (keys[0] === "email") {
        message = EM.EMAIL_EXISTS;
      } else {
        message = EM.DUP_KEY;
      }
    } else {
      message = EM.ERR_UNKNOWN;
    }

    return next(new CustomError(message, 500));
  }

  res.status(201).json(newUser);
});

module.exports = router;
