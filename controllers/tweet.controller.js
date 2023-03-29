const Tweet = require("../models/tweet.model");
const ObjectId = require("mongoose").Types.ObjectId;
const imgbbUploader = require("imgbb-uploader");
const { findHashTag } = require("../helper/findHashTag");

// get all tweets
async function getAllTweets(req, res, next) {
  try {
    const tweets = await Tweet.find().populate("author");
    res.json(tweets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

// create a new tweet
async function createTweet(req, res, next) {
  req.body.author = req.user._id;
  try {
    const { author, content } = req.body;

    if (!author || !content) {
      return res
        .status(400)
        .json({ message: "Author and content are required" });
    }

    const imagesUrls = [];

    const uploadPromises = req.files.map((file) => {
      const opts = {
        apiKey: process.env.IMGBB_KEY,
        base64string: file.buffer.toString("base64"),
      };
      return imgbbUploader(opts).then((response) => {
        return response;
      });
    });

    imagesUrls.push(...(await Promise.all(uploadPromises)));

    const tweet = await Tweet.create({
      author,
      content,
      images: imagesUrls,
    });

    findHashTag(content, tweet);
    res.status(201).json({ tweet });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

async function deleteAllTweets(req, res, next) {
  try {
    const { deletedCount } = await Tweet.deleteMany({});
    if (deletedCount === 0) {
      return res.status(404).json({ message: "No tweets found" });
    }
    return res.status(200).json({ message: "All tweets are deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateTweet(req, res, next) {
  req.body.author = req.user._id;
  try {
    const { tweetId } = req.params;

    if (!ObjectId.isValid(tweetId)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const { content, author } = req.body;

    if (!content || !author) {
      return res
        .status(400)
        .json({ message: "content and author are required" });
    }

    const imagesUrls = [];

    const uploadPromises = req.files.map((file) => {
      const opts = {
        apiKey: process.env.IMGBB_KEY,
        base64string: file.buffer.toString("base64"),
      };
      return imgbbUploader(opts).then((response) => {
        return response;
      });
    });

    imagesUrls.push(...(await Promise.all(uploadPromises)));

    const tweet = await Tweet.findByIdAndUpdate(
      tweetId,
      { author, content, images: imagesUrls },
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

async function patchTweet(req, res, next) {
  req.body.author = req.user._id;
  try {
    const { tweetId } = req.params;

    if (!ObjectId.isValid(tweetId)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const { content, author } = req.body;

    const updatedFields = {};

    if (content) {
      updatedFields.content = content;
    }

    if (author) {
      updatedFields.author = author;
    }

    if (req.files && req.files.length > 0) {
      const imagesUrls = [];

      const uploadPromises = req.files.map((file) => {
        const opts = {
          apiKey: process.env.IMGBB_KEY,
          base64string: file.buffer.toString("base64"),
        };
        return imgbbUploader(opts).then((response) => {
          return response;
        });
      });

      imagesUrls.push(...(await Promise.all(uploadPromises)));

      updatedFields.images = imagesUrls;
    }

    const tweet = await Tweet.findByIdAndUpdate(
      tweetId,
      { $set: updatedFields },
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
    const { tweetId } = req.params;

    if (!ObjectId.isValid(tweetId)) {
      return res.status(400).json({ message: "Invalid tweet ID" });
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

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
    const { tweetId } = req.params;

    if (!ObjectId.isValid(tweetId)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const tweet = await Tweet.findOne({ _id: tweetId }).populate("author");

    if (!tweet) {
      return res.status(404).json({ message: "tweet is not found" });
    }

    res.status(200).json({ tweet });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

async function handleLike(req, res, next) {
  try {
    const { tweetId } = req.params;
    const userId = req.user._id;

    if (!ObjectId.isValid(tweetId)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const liked = tweet.likes.includes(userId);

    if (liked) {
      // Remove user ID from likes array
      await Tweet.findByIdAndUpdate(tweetId, { $pull: { likes: userId } });
      res.status(200).json({ message: "Like removed" });
    } else {
      // Add user ID to likes array
      await Tweet.findByIdAndUpdate(tweetId, { $addToSet: { likes: userId } });
      res.status(200).json({ message: "Tweet liked" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

async function getAllLikes(req, res, next) {
  try {
    const { tweetId } = req.params;

    if (!ObjectId.isValid(tweetId)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const tweet = await Tweet.findById(tweetId).populate({
      path: "likes",
      select: "username name profileUrl",
    });

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    res.status(400).json({ likes: tweet.likes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllTweets,
  updateTweet,
  createTweet,
  deleteTweet,
  findTweet,
  patchTweet,
  deleteAllTweets,
  handleLike,
  getAllLikes,
};
