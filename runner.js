const childProcess = require("child_process");
const schedule = require("node-schedule");

schedule.scheduleJob("0/60 * * * *", () => {
    const process = childProcess.spawn("node index.js", {
        shell: true,
        detached: true,
        stdio: "ignore",
    });
    process.unref();
});
