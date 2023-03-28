const passport = require("passport");
const User = require("../models/user.model");
const getToken = require("../helper/creatToken");

exports.singUpUser = async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
    });

    await User.register(user, req.body.password);
    passport.authenticate("local")(req, res, () => {
      res.status(200).json({
        status: "Register successfully!",
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

exports.unfollowUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const followerId = req.user._id;

    const result = await User.unfollowUser(followerId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.followUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const followerId = req.user._id;

    const result = await User.followUser(followerId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "No body provided" });
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.partiallyUpdateUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "No body provided" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
