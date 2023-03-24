var router = require("express").Router();
const User = require("../models/user.model");
const { verifyUser, verifyAdmin } = require("../middleware/authenticate");
const {
  singUpUser,
  sendToken,
  logInUser,
  getUsers,
  followUser,
  unfollowUser,
} = require("../controllers/user.conroller");

/* GET users listing. */
router.get("/", verifyUser, verifyAdmin, getUsers);

router.post("/:userId/follow", verifyUser, followUser);

router.post("/:userId/unfollow", verifyUser, unfollowUser);

// Singup route
router.post("/signup", singUpUser);

// login route
router.post("/login", logInUser, sendToken);

module.exports = router;
