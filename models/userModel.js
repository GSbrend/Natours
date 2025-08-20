const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");

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
    trim: true,
    validate: {
      validator: function (val) {
        return validator.isEmail(val);
      },
      message: "Please, enter a valid email",
    },
  },
  photo: {
    type: String,
    trim: true,
    required: [true, "A user must have a photo"],
  },
  password: {
    type: Number,
    required: [true, "A password is necessary"]
  },
  passwordConfirm: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

// MONGOOSE MIDDLEWARES

//document middleware: runs before the .save() and .create()
userSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
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
