const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const EM = require("../Util/texts");

const { getHashedValue, matchHash } = require("../Util/functions");

const UserObj = {
  firstName: {
    type: String,
    required: [true, "Field FIRST NAME is required"],
    default: null,
  },
  lastName: {
    type: String,
    required: [true, "Field LAST NAME is required"],
    default: null,
  },
  email: {
    type: String,
    unique: [true, "This EMAIL ADDRESS is already in use"],
    required: [true, "Email id is reuquired"],
    validate: [validator.isEmail, "Invalid email id"],
  },
  password: {
    type: String,
    minLength: [5, "Given PASSWORD is shorter than minimum length (5)"],
    required: [true, "PASSWORD is required"],
  },
  profileImage: {
    type: String,
    default: null,
  },
  signupDate: {
    type: Date,
    default: null,
  }
};

var UserSchema = mongoose.Schema(UserObj);

UserSchema.pre("save", async function (next) {
  var user = this;

  if (user.isModified("password")) {
    let tempPass = await getHashedValue(user.password);
    if (tempPass) {
      user.password = tempPass;
    }
  }
  next();
});

UserSchema.methods.toJSON = function () {
  var user = this;
  return _.pick(user, ["_id","firstName", "lastName", "email"]);
};

UserSchema.set('toJSON', {
  virtuals: true
});

UserSchema.methods.generateAuthToken = async function () {
  var user = this;
  try {
    var token = jwt.sign(
      { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
      EM.JWT_KEY
    );
    return token;
  } catch (e) {
    throw new Error("Failed to generate token");
  }
};

var User = mongoose.model("User", UserSchema);

module.exports = { User };
