const fs = require("node:fs/promises");
const path = require("node:path");

const rotateLog = async (filePath) => {
  const limit = 1;
  try {
    const stats = await fs.stat(filePath);
    if (stats.size <= limit) {
      console.log(`${filePath} is ${stats.size} bytes: no nedded rotation`);
    } else {
        const pth = path.parse(filePath);
        const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
        const resPath = `${pth.name}-${timestamp}${pth.ext}`;
        await fs.rename(filePath, resPath);

        await fs.writeFile(filePath, '');
        console.log(`Rotated: ${filePath} -> ${resPath}`);
    }

  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`No log file yet at ${filePath} -- nothing to rotate.`);
    }
    throw err;
  }
};

rotateLog("app.log");
