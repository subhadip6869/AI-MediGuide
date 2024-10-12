const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/find", (req, res) => {
    res.render("find_med");
});

router.get("/symptoms", async (req, res) => {
    const host = req.headers.host;
    const protocol = req.protocol;

    const resp = await fetch(`${protocol}://${host}/api/symptom`);
    const data = await resp.json();
    const available_symp = data["data"];
    res.render("find_symptoms", {
        available: available_symp.map((s) => ({ name: s }))
    });
});

module.exports = router;