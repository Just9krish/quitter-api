const {
  findTweetWithSpecificTag,
} = require("../controllers/hashTag.controller");
const router = require("express").Router();

router.get("/:hashtag", findTweetWithSpecificTag);

module.exports = router;
