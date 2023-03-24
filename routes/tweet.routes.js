const router = require("express").Router();
const {
  getAllTweets,
  createTweet,
  findTweet,
  updateTweet,
  deleteTweet,
  patchTweet,
} = require("../controllers/tweet.controller");
const upload = require("../middleware/upload");
const {
  getTweetAllReplies,
  postReplyInTweet,
} = require("../controllers/tweetReplies.controller");

const { verifyUser } = require("../middleware/authenticate");

// get all tweets
router.get("/", getAllTweets);

// create new tweet
router.post("/", verifyUser, upload, createTweet);

// get single tweet
router.get("/:tweetId", findTweet);

// patch a tweet
router.patch("/:tweetId", verifyUser, upload, patchTweet);

//update a tweet
router.put("/:tweetId", verifyUser, upload, updateTweet);

// delete a tweet
router.delete("/:tweetId", verifyUser, deleteTweet);

// -------- tweet replies routes ----------- //

router.get("/:tweetId/replies", getTweetAllReplies);

router.post("/:tweetId/replies", verifyUser, postReplyInTweet);

module.exports = router;
