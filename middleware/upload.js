const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).any();

module.exports = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ message: "Too many files uploaded" });
      }
      return res.status(400).json({ message: err.message });
    }
    return next();
  });
};
