const mongoose = require("mongoose");
const AdminSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = Admin = mongoose.model("admin", AdminSchema);
