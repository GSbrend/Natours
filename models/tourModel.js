// create a schema to create a module
// the schema is used to define the structure of the documents within a collection
const mongoose = require("mongoose");
const slugify = require("slugify");
const util = require('util');
const validator = require('validator');
const tourSchema = new mongoose.Schema(
  {
    // basic way to define a schema
    //name: String,
    // schema type options
    name: {
      type: String,
      required: [true, "Please provide a name"],
      unique: true,
      trim: true,
      maxlenght: [40 , 'A tour must have less or equal than 40 characters'], // str validators
      minlenght: [10 , 'A tour must have more or equal than 10 characters'], // str validators
      validate: {
        validator: function(val) {
         return validator.isAlpha(val.replace(/ /g, ''));
        },
        message: 'Tour name must only contain characters.'
      }
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: { //enum is oly for strings
        values: ['easy','medium','difficult'],
        message: 'Difficulty is either easy, medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [1, 'Rating must be above 1.0'], // num / dates validators
      max: [5, 'Rating must be below 5.0'] // num / dates validators
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // 'this' only gives access to create a NEW doc
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the regular price'
      }
    },
    summary: {
      type: String,
      trim: true, //cuts off all the white space at the beggining and ending of the input
    },
    desription: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      trim: true,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  /* virtual properties */ {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationweeks").get(function () {
  return this.duration / 7;
});

// MONGOOSE MIDDLEWARES

//document middleware: runs before the .save() and .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE
// middleware that runs before any query is found (a pre-find hook)
tourSchema.pre(
  /^find/,
  /* regular expression to match with any query proprety that start with 'find' */ function (
    next
  ) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now(); //shows the time when it started to run
    next();
  }
);

tourSchema.post(/^find/, function (docs, next) {
  console.log(`query took ${Date.now() - this.start} milliseconds`); //shows the time when it loaded - the time when it started to run = the time it took to load
  next();
});

// AGGREGATION MIDDLEWARE
// middleware that runs before or after any aggregation happens on code
tourSchema.pre('aggregate', function (next) {
  this._pipeline.unshift({$match:{secretTour:{$ne: true}}});
  // console.log(util.inspect(this._pipeline,false,null,true));
  next();
});

// creating a model from the schema
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
