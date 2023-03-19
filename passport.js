const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.model");

exports.local = passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.serializeUser(User.deserializeUser());

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
};

exports.jwtPassport = passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    console.log(jwtPayload);
    const user = await User.findOne({ _id: user.id });
    console.log(user);
  })
);
