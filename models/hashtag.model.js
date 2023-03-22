const mongoose = require("mongoose");

const hashtagSchema = new mongoose.Schema({
  tag: {
    type: String,
    unique: true,
  },
  tweets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
  ],
});

module.exports = mongoose.model("Hashtag", hashtagSchema);
