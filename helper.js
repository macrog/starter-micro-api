const common = require("./common");

exports.knowSureThingStrategy = (tickerArrayData) => {
    const close = tickerArrayData.map((t) => t.close);
    const kst = common.calculateKST(close);
    const kri = common.calculateKRI(close);

    console.log("knowSureThingStrategy ready");
};
