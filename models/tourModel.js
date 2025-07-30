// create a schema to create a module
// the schema is used to define the structure of the documents within a collection
const mongoose = require("mongoose");
const tourSchema = new mongoose.Schema({
// basic way to define a schema
  //name: String,
// schema type options
  name: {
    type: String,
    required: [true, "Please provide a name"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 3.5,
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
  },
});
// creating a model from the schema
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;