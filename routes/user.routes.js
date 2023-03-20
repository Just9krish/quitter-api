var router = require("express").Router();
const User = require("../models/user.model");
const { verfiyUser, verifyAdmin } = require("../middleware/authenticate");
const {
  singUpUser,
  sendToken,
  logInUser,
} = require("../controllers/user.conroller");

/* GET users listing. */
router.get("/", verfiyUser, verifyAdmin, async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Singup route
router.post("/signup", singUpUser);

// login route
router.post("/login", logInUser, sendToken);

module.exports = router;
