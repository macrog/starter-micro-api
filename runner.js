const childProcess = require("child_process");
const schedule = require("node-schedule");

// At every 29th from 29 through 59. hh:29, hh:59
schedule.scheduleJob("0/60 * * * *", () => {
    const process = childProcess.spawn("node index.js", {
        shell: true,
        detached: true,
        stdio: "ignore",
    });
    process.unref();
});
