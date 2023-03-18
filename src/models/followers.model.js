const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const followersSchema = new Schema(
  {
    follower: { type: Schema.Types.ObjectId, ref: "User" },
    followedUser: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Followers", followersSchema);
