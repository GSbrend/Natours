// isn't express? so be my guest!
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const app = require("./app");


const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("DB connection successfull");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}...`);
});
