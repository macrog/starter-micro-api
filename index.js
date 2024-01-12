//  node index.js
//  1 - <timeFrame>
//  2 - <type>  CROSSAFTERRSIDIP-RSI3GREEN
//  3 - <volumeLevel>
//  4 - <rsiAboveValue>
//  5 - <rsiAboveEMARsi>
//  6 - <previousCandle>
//  7 - <rsiValue>

const common = require("./common");
const service = require("./service");
const helper = require("./helper");
const list = require("./list");

const totalTickers = list.length;
const types = ["KST1H"];

const currentFile = "index.js";
const logFile = "index.log";
const args = process.argv.slice(2);

let timeFrame = args[0] ? args[0] : 60;
let type = args[1] ? args[1] : "KST1H";

// check for multiple params passed in as type, or convert a single one to array
if (type.indexOf("-") !== -1) {
    type = type.split("-");
} else {
    type = [type];
}

let wrongParam = false;
type.forEach((t) => {
    wrongParam = !types.includes(t);
});

if (wrongParam) {
    console.log(
        "TYPE argunents do not match, reveived: " + type,
        "allowed combinations of : " + types.join(", ") + " connected with '|'"
    );

    process.exit();
}

const date = new Date();

date.setSeconds(0);

const requestTime = date.getTime();
const oneMinuteMilisec = 60000;

let index = 0;
let tickerReturned = 0;
let results = [];

function getTickerValues() {
    const time = parseFloat(
        (requestTime - timeFrame * oneMinuteMilisec * 200)
            .toString()
            .slice(0, -3)
    );
    const slice = common.getArraySlice(list, index);

    slice.forEach((ticker, i) => {
        try {
            service
                .getTicker(
                    ticker,
                    timeFrame === 1440 ? "D" : timeFrame,
                    200,
                    time
                )
                .then((response) => {
                    tickerReturned++;
                    analyzeResult(response, ticker);

                    if (tickerReturned === common.sliceSize) {
                        index++;
                        if (index * common.sliceSize < totalTickers) {
                            common.loading(index, totalTickers);
                            tickerReturned = 0;
                            getTickerValues(index);
                        } else {
                            if (results.length > 0) {
                                results.sort(
                                    (a, b) => b.volumeRatio - a.volumeRatio
                                );
                            }

                            common.end(results, timeFrame, "logs/" + logFile);
                        }
                    } else {
                        if (
                            index * common.sliceSize + tickerReturned ===
                            totalTickers
                        ) {
                            if (results.length > 0) {
                                results.sort(
                                    (a, b) => b.volumeRatio - a.volumeRatio
                                );
                            }
                            common.end(results, timeFrame, "logs/" + logFile);
                        }
                    }
                })
                .catch((e) =>
                    common.logIt(
                        common.errorLogFile,
                        `${common.getTimeLocal()}, ${currentFile} - error stack: ${
                            e.stack ? e.stack : "unknown stack"
                        }`
                    )
                );
        } catch (e) {
            common.logIt(
                common.errorLogFile,
                `${common.getTimeLocal()}, ${currentFile} - error stack: ${
                    e.stack ? e.stack : "unknown stack"
                }`
            );
        }
    });
}

function analyzeResult(tickerArrayData, ticker) {
    if (!Array.isArray(tickerArrayData)) {
        console.log(
            "Something went wrong, not an array returned from bybit",
            tickerArrayData
        );
        return null;
    }

    if (
        common.getLastElementOfArray(tickerArrayData).start_at.toString() ===
        requestTime.toString().slice(0, -3)
    ) {
        tickerArrayData.pop();
    }

    if (type.includes("KST1H")) {
        if (helper.knowSureThingStrategy(tickerArrayData)) {
            addResults({
                ticker: ticker,
                type: "KST1H",
            });
        }
    }
}

function addResults(pass) {
    if (pass && !!pass.ticker) {
        results.push(pass);
    }
}

getTickerValues();
