const User = require("../models/user.model");
const Tweet = require("../models/tweet.model");
const Hash = require("../models/hashtag.model");

exports.search = async (req, res, next) => {
  try {
    const { query } = req.query;

    const result = await Promise.all([
      Tweet.find({ content: { $regex: query, $options: "i" } }),
      Hash.find({ tag: { $regex: query, $options: "i" } }),
      User.find({ name: { $regex: query, $options: "i" } }).populate("tweets"),
    ]);

    res.status(200).json(result.flat());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
