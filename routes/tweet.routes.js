const router = require("express").Router();
const {
  getAllTweets,
  createTweet,
  findTweet,
  updateTweet,
  deleteTweet,
} = require("../controllers/tweet.controller");

// get all tweets
router.get("/", getAllTweets);

// create new tweet
router.post("/", createTweet);

// get single tweet
router.get("/:id", findTweet);

//update a tweet
router.put("/:id", updateTweet);

// delete a tweet
router.delete("/:id", deleteTweet);

module.exports = router;
