const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const TaxSchema = new mongoose.Schema(
  {
    state: {
      type: String,
    },
    percent: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
TaxSchema.plugin(mongoosePaginate);
module.exports = Tax = mongoose.model("tax", TaxSchema);
