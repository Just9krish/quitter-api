const Hashtag = require("../models/hashtag.model");

exports.findHashTag = (content, newTweet) => {
  const hashTags = content.match(/#\w+/g);

  if (hashTags) {
    hashTags.forEach(async (tag) => {
      const existingHashtag = await Hashtag.findOne({ tag });

      if (existingHashtag) {
        // If the hashtag already exists, add the tweet ID to its 'tweets' array
        existingHashtag.tweets.push(newTweet._id);

        await existingHashtag.save();
      } else {
        // If the hashtag doesn't exist, create a new document for it
        const newHashtag = new Hashtag({ tag, tweets: [newTweet._id] });
        await newHashtag.save();
      }
    });
  }
};
