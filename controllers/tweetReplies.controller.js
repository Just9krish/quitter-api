const ObjectId = require("mongoose").Types.ObjectId;
const Tweet = require("../models/tweet.model");

// get all replies of tweet
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

// reply to tweet
exports.postReplyInTweet = async (req, res, next) => {
  try {
    const { tweetId } = req.params;
    const userId = req.user._id;

    if (!ObjectId.isValid(tweetId)) {
      return res.status(400).json({ message: "Invalid tweet ID" });
    }

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

// delete replies of tweet
exports.deleteAllRepliesOfTweet = async (req, res, next) => {
  try {
    const { tweetId } = req.params;
    const userId = req.user._id;

    if (!ObjectId.isValid(tweetId)) {
      return res.status(400).json({ message: "Invalid tweet ID" });
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    tweet.replies = [];

    await tweet.save();
    res.status(200).json({ message: "All replies removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// get single reply of tweet
exports.getReplyOfTweet = async (req, res, next) => {
  try {
    const { tweetId, replyId } = req.params;

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

    const reply = tweet.replies.id(replyId);

    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    res.status(200).json(reply);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateReplyOfTweet = async (req, res, next) => {
  try {
    const { tweetId, replyId } = req.params;
    const userId = req.user._id;

    if (!ObjectId.isValid(tweetId)) {
      return res.status(400).json({ message: "Invalid tweet ID" });
    }

    let tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const reply = tweet.replies.id(replyId);

    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    if (reply.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can not edit this reply" });
    }

    reply.content = req.body.content;

    await tweet.save();

    tweet = await Tweet.findById(tweetId)
      .populate({
        path: "replies",
        populate: { path: "author", select: "username profileUrl" },
      })
      .populate("author", "username profileUrl");

    res.status(200).json(tweet);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReplyOfTweet = async (req, res, next) => {
  try {
    const { tweetId, replyId } = req.params;
    const userId = req.user._id;

    if (!ObjectId.isValid(tweetId)) {
      return res.status(400).json({ message: "Invalid tweet ID" });
    }

    let tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const reply = tweet.replies.id(replyId);

    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    if (reply.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can not delete this reply" });
    }

    await reply.remove();

    await tweet.save();

    tweet = await Tweet.findById(tweetId)
      .populate({
        path: "replies",
        populate: { path: "author", select: "username profileUrl" },
      })
      .populate("author", "username profileUrl");

    res.status(200).json(tweet);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
