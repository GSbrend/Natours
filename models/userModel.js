const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const catchAsync = require("../Utils/catchAsync");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    trim: true,
    minlenght: [10, "A name must have at least 10 characters"],
    validate: {
      validator: function (val) {
        return validator.isAlpha(val.replace(/ /g, ""));
      },
      message: "A name must only contain characters",
    },
  },
  slug: String,
  email: {
    type: String,
    required: [true, "Please, enter an email"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Please, enter a valid email"],
  },
  photo: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "A password is necessary"],
    validate: [
      validator.isStrongPassword,
      "A password must have 8 characters or more, a symbol, a number, a lowercase and an uppercase letter.",
    ],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please, confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "The passwords are not the same!",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

// MONGOOSE MIDDLEWARES

//document middleware: runs before the .save() and .create()
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

// QUERY MIDDLEWARE
userSchema.pre(/^find/, function (next) {
  this.find({ secretUser: { $ne: true } });
  this.start = Date.now(); //shows the time when it started to run
  next();
});

userSchema.post(/^find/, function (docs, next) {
  console.log(`query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREGATION MIDDLEWARE
userSchema.pre("aggregate", function (next) {
  this._pipeline.unshift({ $match: { secretUser: { $ne: true } } });
  // console.log(util.inspect(this._pipeline,false,null,true));
  next();
});

// creating a model from the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
