const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/find", (req, res) => {
    res.render("find_med");
})

module.exports = router;