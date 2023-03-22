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

const { verifyUser } = require("../middleware/authenticate");

// get all tweets
router.get("/", getAllTweets);

// create new tweet
router.post("/", verifyUser, upload, createTweet);

// get single tweet
router.get("/:id", findTweet);

// patch a tweet
router.patch("/:id", verifyUser, upload, patchTweet);

//update a tweet
router.put("/:id", verifyUser, upload, updateTweet);

// delete a tweet
router.delete("/:id", verifyUser, deleteTweet);

module.exports = router;
