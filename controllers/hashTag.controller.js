const Hashtag = require("../models/hashtag.model");

async function findTweetWithSpecificTag(req, res, next) {
  try {
    console.log("run");
    const hashtag = req.params.hashtag;
    const hashtagDoc = await Hashtag.findOne({ tag: `#${hashtag}` }).populate(
      "tweets"
    );

    const tweets = hashtagDoc ? hashtagDoc.tweets : [];
    res.status(200).json({ tweets });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Somethin went wrong" });
  }
}

module.exports = { findTweetWithSpecificTag };
