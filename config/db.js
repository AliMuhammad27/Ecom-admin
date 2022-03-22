const mongoose = require("mongoose");
const config = require("config");
const db = config.get("dbUrl");

const connection = async () => {
  try {
    await mongoose.connect(db);
    console.log("Connected to db");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connection;
