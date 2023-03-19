const Tweet = require("../models/tweet.model");
const ObjectId = require("mongoose").Types.ObjectId;

async function createTweet(req, res, next) {
  try {
    const { author, content, images } = req.body;

    if (!author || !content) {
      return res
        .status(400)
        .json({ message: "Author and content are required" });
    }

    const tweet = await Tweet.create({
      author,
      content,
      images,
    });

    res.status(201).json({ tweet });
  } catch (error) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function updateTweet(req, res, next) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const { images, content } = req.body;

    if (!images || !content) {
      return res
        .status(400)
        .json({ message: "Both images and content are required" });
    }

    const tweet = await Tweet.findByIdAndUpdate(
      id,
      { content, images },
      { new: true }
    );

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    res.status(200).json({ tweet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function deleteTweet(req, res, next) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid tweet ID" });
    }

    const deletedTweet = await Tweet.findByIdAndDelete(id);

    if (!deletedTweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    res.status(200).json({ message: "Tweet deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function findTweet(req, res, next) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const tweet = await Tweet.findOne({ _id: id });

    if (!tweet) {
      return res.status(404).json({ message: "tweet is not found" });
    }

    res.status(200).json({ tweet });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function getAllTweets(req, res, next) {
  try {
    const tweets = await Tweet.find();
    res.json(tweets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = {
  getAllTweets,
  updateTweet,
  createTweet,
  deleteTweet,
  findTweet,
};
