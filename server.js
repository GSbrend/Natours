// isn't express? so be my guest!
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<password>", process.env.DB_PASSWORD);


mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => console.log("DB connection successfull"));
  
  // create a schema to create a module
  // the schema is used to define the structure of the documents within a collection

const tourSchema = new mongoose.Schema({
  // basic way to define a schema
  //name: String,
  // schema type options
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 3.5,
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
  },
});

// creating a model from the schema
const Tour = mongoose.model('Tour', tourSchema);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}...`);
});
