var router = require("express").Router();
const { verifyUser, verifyAdmin } = require("../middleware/authenticate");
const {
  singUpUser,
  sendToken,
  logInUser,
  getUsers,
  followUser,
  unfollowUser,
  updateUser,
  partiallyUpdateUser,
} = require("../controllers/user.conroller");

/* GET users listing. */
router.get("/", verifyUser, verifyAdmin, getUsers);

// completly update user
router.put("/", verifyUser, updateUser);

// partially update user
router.patch("/", verifyUser, partiallyUpdateUser);

// follow user
router.post("/:userId/follow", verifyUser, followUser);

// unfollow user
router.post("/:userId/unfollow", verifyUser, unfollowUser);

// Singup route
router.post("/signup", singUpUser);

// login route
router.post("/login", logInUser, sendToken);

module.exports = router;
