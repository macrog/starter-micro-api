const SMA = require("technicalindicators").SMA;
const KST = require("technicalindicators").KST;
const CROSS_UP = require("technicalindicators").CrossUp;
const CROSS_DOWN = require("technicalindicators").CrossDown;
const EMA = require("technicalindicators").EMA;

const fs = require("fs");

// [time, open, high, low, close, volume,] = last_tick;
// [0      1     2     3     4       5   ] = last_tick;

exports.TIME = 0;
exports.OPEN = 1;
exports.HIGH = 2;
exports.LOW = 3;
exports.CLOSE = 4;
exports.VOLUME = 5;
exports.sliceSize = 10;
exports.allDone = false;
exports.errorLogFile = "logs/error.log";
exports.emaLogFile = "logs/ema-cross.log";

exports.getArraySlice = (array, i) => {
    return array.slice(i * this.sliceSize, (i + 1) * this.sliceSize);
};

exports.loading = (index, totalTickers) => {
    return process.stdout.write(
        this.round((index * this.sliceSize * 100) / totalTickers) + "% ... \r"
    );
};

exports.end = (results, timeFrame, fileName, time) => {
    endTime = new Date();
    let timeDiff = endTime - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;

    // get seconds
    const seconds = Math.round(timeDiff);

    if (results.length && fileName) {
        console.log(
            `Results number: ${results.length}, Took ${seconds} seconds. Finished on: ${endTime}`
        );
        // console.table(results);
        const text =
            "[\n" + results.map((e) => JSON.stringify(e)).join(",\n") + "\n]";
        this.logIt(
            fileName,
            `${this.getTimeLocal()}
      ${text}
      ------------------------------------------------------------------------------------- `
        );
    } else if (fileName) {
        this.logIt(
            fileName,
            `${this.getTimeLocal(time)}
      No results found for time-frame: ${timeFrame}
      ------------------------------------------------------------------------------------- `
        );
    }
};

exports.logIt = (file, msg) => {
    fs.writeFileSync(file, msg + "\n", {
        encoding: "utf8",
        flag: "a+",
        mode: 0o666,
    });
};

exports.getTimeLocal = (timeInMilisec) => {
    return timeInMilisec
        ? new Date(timeInMilisec).toLocaleString()
        : new Date().toLocaleString();
};

exports.getLastElementOfArray = (array) => {
    return array.slice(-1)[0];
};

exports.calculateKST = (priceArray) => {
    var input = {
        values: priceArray,
        ROCPer1: 10,
        ROCPer2: 15,
        ROCPer3: 20,
        ROCPer4: 30,
        SMAROCPer1: 10,
        SMAROCPer2: 10,
        SMAROCPer3: 10,
        SMAROCPer4: 15,
        signalPeriod: 9,
    };

    return KST.calculate(input);
};

exports.calculateKRI = (priceArray) => {
    const sma = this.calculateSMA(priceArray, 89);
    kri = sma.map((s, i) => (100 * (priceArray[88 + i] - s)) / s);
    return this.getLastElementOfArray(kri);
};

exports.calculateSMA = (volumeArray, period = 20) => {
    return SMA.calculate({ period: period, values: volumeArray });
};

exports.calculateCrossUp = (input) => {
    return CROSS_UP.calculate(input);
};

exports.calculateCrossDown = (input) => {
    return CROSS_DOWN.calculate(input);
};

exports.calculateEMA = (volumeArray, period = 20) => {
    return EMA.calculate({ period: period, values: volumeArray });
};
