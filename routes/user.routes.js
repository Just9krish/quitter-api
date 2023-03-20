var router = require("express").Router();
const User = require("../models/user.model");
const { verifyUser, verifyAdmin } = require("../middleware/authenticate");
const {
  singUpUser,
  sendToken,
  logInUser,
  getUsers,
} = require("../controllers/user.conroller");

/* GET users listing. */
router.get("/", verifyUser, verifyAdmin, getUsers);

// Singup route
router.post("/signup", singUpUser);

// login route
router.post("/login", logInUser, sendToken);

module.exports = router;
