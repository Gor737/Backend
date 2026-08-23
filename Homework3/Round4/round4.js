const fs = require("node:fs");

const streamingWordCounter = (filePath) => {
  let wordCount = 0;
  let bytesProcessed = 0;
  let leftover = "";
  const stream = fs.createReadStream(filePath, { flags: "r", highWaterMark: 4});
  stream.on("data", (chunk) => {
    console.log(chunk.toString());
    let text = (leftover + chunk.toString()).trimStart();
    const parts = text.split(/\s+/);
    if(/\s$/.test(text)){
        leftover = '';
        wordCount += parts.length - 1;
    }
    else{
        leftover = parts[parts.length - 1];
        wordCount += parts.length - 1;
    }
    bytesProcessed += chunk.length;
  });
  stream.on("end", () => {
    if(leftover) ++wordCount;
    console.log(`
        word count: -> ${wordCount}
        bytes processed: -> ${bytesProcessed}
    `);
  });
};

streamingWordCounter("test.txt");
