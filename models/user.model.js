const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },

  name: {
    type: String,
    default: "Mr. Unknown",
  },

  profileUrl: {
    type: String,
    default: "https://i.ibb.co/kK2JV13/Png-Item-1503945.png",
  },

  bannerUrl: {
    type: String,
    default:
      "https://i.ibb.co/4ST75gJ/banner-full-blue-scratch-jpg-twimg-1280.jpg",
  },

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  followings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  bio: {
    type: String,
    default: null,
  },

  location: {
    type: String,
    default: null,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(passportLocalMongoose);

userSchema.statics.followUser = async function (followerId, followeeId) {
  const follower = await this.findById(followerId);
  const followee = await this.findById(followeeId);

  // Check if follower is already following the followee
  if (
    follower.followings.includes(followeeId) &&
    followee.followers.includes(followerId)
  ) {
    return { message: "You are already following this user." };
  }

  follower.followings.push(followeeId);
  followee.followers.push(followerId);

  await follower.save();
  await followee.save();

  return { message: "You are now following this user." };
};

userSchema.statics.unfollowUser = async function (followerId, followeeId) {
  const follower = await this.findById(followerId);
  const followee = await this.findById(followeeId);

  if (
    follower.followings.includes(followeeId) &&
    followee.followers.includes(followerId)
  ) {
    follower.followings.pull(followeeId);
    followee.followers.pull(followerId);

    await follower.save();
    await followee.save();

    return { message: "Unfollowed successfully" };
  } else {
    return { error: "User is not following this account" };
  }
};

module.exports = mongoose.model("User", userSchema);
