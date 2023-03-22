const Tweet = require("../models/tweet.model");
const ObjectId = require("mongoose").Types.ObjectId;
const imgbbUploader = require("imgbb-uploader");

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

    res.status(201).json({ tweet });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function updateTweet(req, res, next) {
  req.body.author = req.user._id;
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
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
      id,
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
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
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
      id,
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
  patchTweet,
};
