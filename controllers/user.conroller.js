const User = require("../models/user.model");
const getToken = require("../helper/creatToken");
const passport = require("passport");
const { session } = require("passport");

async function signUpUser(req, res, next) {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        req.status(500).json({ err });
      } else {
        if (req.body.name) {
          user.name = req.body.name;
        }

        user.save((err, user) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            passport.authenticate("local")(req, res, () => {
              res.status(200).json({
                message: "Register successfully!",
              });
            });
          }
        });
      }
    }
  );
}

async function loginUser(req, res, next) {
  passport.authenticate("local", { session: false });
}

function sendToken(req, res, next) {
  const token = getToken(req.user);

  res.status(200).json({ token });
}
