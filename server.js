// isn't express? so be my guest!
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("DB connection successfull");
});

// create a schema to create a module
// the schema is used to define the structure of the documents within a collection

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
const Tours = mongoose.model("Tour", tourSchema);

//fist code interaction with mongoose
const testTour = new Tour({
  name: "Askhaban prision",
  rating: 5.0,
  price: 530,
});

// saving the new instance inside the database collection
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log("Error!:", err);
  }); // this .save() is a promisse, which can be consumed

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}...`);
});
