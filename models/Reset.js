const mongoose = require("mongoose");
const ResetSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = Reset = mongoose.model("reset", ResetSchema);
