// create a schema to create a module
// the schema is used to define the structure of the documents within a collection
const mongoose = require("mongoose");
const slugify = require('slugify');
const tourSchema = new mongoose.Schema({
  // basic way to define a schema
  //name: String,
  // schema type options
  name: {
    type: String,
    required: [true, "Please provide a name"],
    unique: true,
    trim: true
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 0,
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true //cuts off all the white space at the beggining and ending of the input
  },
  desription: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date]
},/* virtual properties */ {
  toJSON: { virtuals: true},
  toObject: { virtuals: true}
});

tourSchema.virtual('durationweeks').get(function() {
  return this.duration / 7;
});
//document middleware: runs before the .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true});
  next();
});

tourSchema.post('save', function(doc, next){
  console.log(doc);
  next();
});

// creating a model from the schema
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
