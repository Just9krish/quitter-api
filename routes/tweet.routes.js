const router = require("express").Router();
const {
  getAllTweets,
  createTweet,
  findTweet,
  updateTweet,
  deleteTweet,
  patchTweet,
  deleteAllTweets,
} = require("../controllers/tweet.controller");
const upload = require("../middleware/upload");
const {
  getTweetAllReplies,
  postReplyInTweet,
  deleteAllRepliesOfTweet,
  getReplyOfTweet,
  updateReplyOfTweet,
  deleteReplyOfTweet,
} = require("../controllers/tweetReplies.controller");

const { verifyUser, verifyAdmin } = require("../middleware/authenticate");

// get all tweets
router.get("/", getAllTweets);

// create new tweet
router.post("/", verifyUser, upload, createTweet);

// cannot update the tweets
router.put("/", (req, res) => {
  res
    .status(403)
    .json({ message: `PUT operation is not supported on ${req.path}` });
});

// deleting all tweets
router.delete("/", verifyUser, verifyAdmin, deleteAllTweets);

// get single tweet
router.get("/:tweetId", findTweet);

// cannot create tweet in tweet
router.post("/:tweetId", (req, res) => {
  res
    .status(403)
    .json({ message: `POST operation is not allowed on ${req.path}` });
});

// patch a tweet
router.patch("/:tweetId", verifyUser, upload, patchTweet);

//update a tweet
router.put("/:tweetId", verifyUser, upload, updateTweet);

// delete a tweet
router.delete("/:tweetId", verifyUser, deleteTweet);

// -------- tweet replies routes ----------- //

// get all replies of single tweet
router.get("/:tweetId/replies", getTweetAllReplies);

// post a single reply in sinlge tweet
router.post("/:tweetId/replies", verifyUser, postReplyInTweet);

// cannot perform put operation on replies
router.put("/:tweetId/replies", verifyUser, (req, res) => {
  res
    .status(403)
    .json({ message: `PUT operation cannot be perform on ${req.path}` });
});

// delete all the replies of a tweet
router.delete(
  "/:tweetId/replies",
  verifyUser,
  verifyAdmin,
  deleteAllRepliesOfTweet
);

// get single reply of a tweet
router.get("/:tweetId/replies/:replyId", getReplyOfTweet);

// cannot post the reply in reply
router.post("/:tweetId/replies/:replyId", verifyUser, (req, res) => {
  res
    .status(403)
    .json({ message: `POST operation cannot perform on the ${req.path}` });
});

// update the single reply of tweet
router.put("/:tweetId/replies/:replyId", verifyUser, updateReplyOfTweet);

// delete the single reply of tweet
router.delete("/:tweetId/replies/:replyId", verifyUser, deleteReplyOfTweet);

module.exports = router;
