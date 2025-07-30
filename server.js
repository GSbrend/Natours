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

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}...`);
});
