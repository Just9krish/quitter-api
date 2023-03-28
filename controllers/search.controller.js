const User = require("../models/user.model");
const Tweet = require("../models/tweet.model");
const Hash = require("../models/hashtag.model");

exports.search = async (req, res, next) => {
  try {
    const { query } = req.query;

    const [tweets, hashtags, users] = await Promise.all([
      Hash.find({ tag: { $regex: query, $options: "i" } }),
      Tweet.find({ content: { $regex: query, $options: "i" } }),
      User.find({ name: { $regex: query, $options: "i" } }),
    ]);

    const results = { tweets, hashtags, users };

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
