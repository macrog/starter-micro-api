const express = require("express");
const bybit = require("./bybit");
const log = require("./logs/index.log");

const app = express();

app.post("/hour", async (req, res) => {
    bybit.getTickerValues();
    res.status(200).send({});
});

app.get("/results", async (req, res) => {
    res.status(200).send(log);
});

app.listen(process.env.PORT || 3000);
