const express = require("express");

const logs = require("../logs/index.js");
const bybit = require("../bybit.js");

const router = new express.Router();

router.get("/results", async (req, res) => {
    try {
        res.status(200).send(logs);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/hour", async (req, res) => {
    try {
        bybit.getTickerValues();
        res.status(200).send({});
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
