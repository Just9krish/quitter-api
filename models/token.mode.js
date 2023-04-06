const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  vToken: {
    type: String,
    default: "",
  },

  rToken: {
    type: String,
    default: "",
  },

  lToken: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Token", tokenSchema);
