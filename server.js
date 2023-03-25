const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const morgan = require("morgan");
const passport = require("passport");

const app = express();

const port = process.env.PORT || 3000;
const dbPath = process.env.DBPATH || "mondodb:2731//text";

// middleware
app.use(morgan("combined"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
const tweetRoutes = require("./routes/tweet.routes");
const userRoutes = require("./routes/user.routes");
const hashRoutes = require("./routes/hashtag.routes");

app.use(passport.initialize());

app.get("/", (req, res) => res.send("home page"));
app.use("/users", userRoutes);

app.use(express.static(path.join(__dirname, "public")));

// tweets routes
app.use("/tweets", tweetRoutes);

// hashtag route
app.use("/hash", hashRoutes);

// catch-all route for handling requests to unknown routes
app.all("*", async (req, res) => {
  res.status(404).json({ message: "Are you stupid?" });
});

mongoose
  .connect(dbPath)
  .then(() =>
    app.listen(port, () => {
      console.log(`Server is listening to port ${port}`);
    })
  )
  .catch((err) => {
    console.log("error for starting the database" + err);
  });
