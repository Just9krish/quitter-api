const passport = require("passport");
const User = require("../models/user.model");
const getToken = require("../helper/creatToken");

exports.singUpUser = async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
    });
    if (req.body.bio) {
      user.bio = req.body.bio;
    }
    await User.register(user, req.body.password);
    passport.authenticate("local")(req, res, () => {
      res.status(200).json({
        status: "Register successfully!",
        success: true,
      });
    });
  } catch (err) {
    if (err.name === "UserExistsError") {
      res.status(409).json({ message: "User already exists" });
    } else {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
exports.logInUser = passport.authenticate("local", { session: false });

exports.sendToken = (req, res) => {
  const token = getToken({ _id: req.user._id });
  res.status(200).json({
    token: token,
  });
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
