const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();

// middleware
app.use(morgan("combined"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
const tweetRoutes = require("./routes/tweet.routes");

// tweets routes
app.use("/tweets", tweetRoutes);

// catch-all route for handling requests to unknown routes
app.all("*", async (req, res) => {
  res.status(404).json({ message: "Are you stupid?" });
});

mongoose
  .connect(process.env.DBPATH || "mongodb://localhost/test")
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening to port ${process.env.PORT}`);
    })
  )
  .catch((err) => {
    console.log("error for starting the database" + err);
  });
