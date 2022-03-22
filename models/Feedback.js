const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const FeedBackSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);
FeedBackSchema.plugin(mongoosePaginate);
module.exports = Feedback = mongoose.model("feedback", FeedBackSchema);
