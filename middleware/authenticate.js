const passport = require("passport");

exports.verifyUser = passport.authenticate("jwt", { session: false });

exports.verifyAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    res
      .status(403)
      .json({ message: "you are not authorized to perform this action" });
  }
};
