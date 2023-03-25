const ObjectId = require("mongoose").Types.ObjectId;
const Tweet = require("../models/tweet.model");

exports.getTweetAllReplies = async (req, res, next) => {
  try {
    const { tweetId } = req.params;

    if (!ObjectId.isValid(tweetId)) {
      return res.status(400).json({ message: "Invalid tweet ID" });
    }

    const tweet = await Tweet.findById(tweetId)
      .populate({
        path: "replies",
        populate: { path: "author", select: "username profileUrl" },
      })
      .populate("author", "username profileUrl");

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    res.status(200).json(tweet.replies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.postReplyInTweet = async (req, res, next) => {
  try {
    const { tweetId } = req.params;
    console.log(req.user);
    const userId = req.user._id;

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const reply = {
      author: userId,
      content: req.body.content,
    };

    tweet.replies.push(reply);

    await tweet.save();

    const populatedTweet = await Tweet.findById(tweetId)
      .populate({
        path: "replies",
        populate: { path: "author", select: "username profileUrl" },
      })
      .populate("author", "username profileUrl");

    res.status(201).json(populatedTweet);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
