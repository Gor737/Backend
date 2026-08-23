const fs = require('node:fs');

const header = {
  magic: 4,
  version: 1,
  recordCount: 2,
};

const record = {
  timestamp: 4,
  temperature: 4,
  sensorId: 1,
};

let bufferSize = 0;
const recordCount = 10;

for (let bytes of Object.values(header)) {
  bufferSize += bytes;
}
for (let bytes of Object.values(record)) {
  bufferSize += bytes * recordCount;
}

const buffer = Buffer.alloc(bufferSize);

buffer.write("SNSR");
buffer.writeUInt8(1, 4);
buffer.writeUInt16BE(recordCount, 5);

const timestamp = 1755600000;
const tempereture = 100;
const sensorId = 3;

let cursor = 7;
for(let i = 0; i < recordCount; ++i){
    buffer.writeUInt32BE(timestamp + i * 60, cursor);
    cursor += record.timestamp;
    buffer.writeFloatBE(Number((Math.random() * tempereture).toFixed(1)), cursor);
    cursor += record.temperature;
    buffer.writeUInt8(Math.floor(Math.random() * sensorId) + 1, cursor);
    cursor += record.sensorId;
}

fs.writeFileSync('./records.bin', buffer);