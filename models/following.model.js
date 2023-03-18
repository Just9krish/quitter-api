const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const followingsSchema = new Schema(
  {
    followingUser: { type: Schema.Types.ObjectId, ref: "User" },
    followed: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Follo", followingsSchema);
