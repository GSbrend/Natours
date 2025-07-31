const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("./../../models/tourModel.js");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("DB connection successfull");
});

// reading json
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

// import to db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data loaded");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('data deleted');
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

