const { LinearClient } = require("bybit-api");

const API_KEY = "4UWBjiFnqasK098Zv9";
const PRIVATE_KEY = "zNdQsomNwouYh3t6jaJdFnZCJc3ZczXK4Yee";
const useLivenet = true;

const client = new LinearClient(API_KEY, PRIVATE_KEY, useLivenet);

const minInMilesec = 60000;

exports.getTicker = async (symbol, interval, limit, from) => {
    time = null;
    if (!from) {
        time = parseInt(
            (
                parseInt(
                    new Date().getTime().toString().slice(0, -4) + "0000"
                ) -
                limit * (interval === "D" ? 1440 : interval) * minInMilesec
            )
                .toString()
                .slice(0, -3)
        );
    } else {
        time = from;
    }

    return await client
        .getKline({
            symbol: symbol,
            interval: interval,
            limit: limit,
            from: time,
        })
        .then((result) => {
            return result.result;
        })
        .catch((err) => {
            return err;
        });
};
