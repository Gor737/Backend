const EventEmitter = require("node:events");

class Downloader extends EventEmitter {
  start() {
    let step = 0;
    const intervalId = setInterval(() => {
      ++step;
      this.emit("progress", step * 10);
      if (step * 10 === 100) {
        clearInterval(intervalId);
        this.emit("done");
      }
    }, 1000);
  }
}

const downloader = new Downloader();

downloader.on("progress", (percent) => {
  const filled = percent / 5;
  const passed = "#".repeat(filled);
  const unpassed = "-".repeat(20 - filled);
  process.stdout.write(`\r [${passed}${unpassed}] ${percent}%`);
  // console.log(`Downloadig in process! --> ${percent}%`);
});

downloader.on("done", () => {
  console.log("\nDownloading complited!");
});

downloader.start();
