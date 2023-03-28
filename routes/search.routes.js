const { search } = require("../controllers/search.controller");

const router = require("express").Router();

router.get("/search", search);

module.exports = router;
