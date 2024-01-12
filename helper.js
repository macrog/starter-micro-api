const common = require("./common");

exports.knowSureThingStrategy = (tickerArrayData) => {
    const close = tickerArrayData.map((t) => t.close);
    const kst = common.calculateKST(close);
    const kri = common.calculateKRI(close);

    const crossUp = common.calculateCrossUp({
        lineA: kst.map((o) => o.kst),
        lineB: kst.map((o) => o.signal),
    });
    const lastCrossUp = common.getLastElementOfArray(crossUp);

    const crossDown = common.calculateCrossDown({
        lineA: kst.map((o) => o.kst),
        lineB: kst.map((o) => o.signal),
    });
    const lastCrossDown = common.getLastElementOfArray(crossDown);

    if (lastCrossUp && kri > 0) {
        const ema = common.calculateEMA(close, 150);
        const lastEma = common.getLastElementOfArray(ema);
        const lastClose = common.getLastElementOfArray(close);
        if (lastClose > lastEma) {
            return true;
        }
        return false;
    } else if (lastCrossDown && kri < 0) {
        const ema = common.calculateEMA(close, 150);
        const lastEma = common.getLastElementOfArray(ema);
        const lastClose = common.getLastElementOfArray(close);
        if (lastClose < lastEma) {
            return true;
        }
        return false;
    } else {
        return false;
    }
};
