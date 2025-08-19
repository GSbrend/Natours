const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (val) {
        return validator.isAlpha(val.replace(/ /g, ""));
      },
      message: "Tour name must only contain characters",
    },
  },
});
