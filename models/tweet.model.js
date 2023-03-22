const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tweet", tweetSchema);
