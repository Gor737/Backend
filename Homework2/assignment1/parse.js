const fs = require("node:fs");

const data = fs.readFileSync("./records.bin");
console.log(data.length === 97);

const magic = data.subarray(0, 4).toString("ascii");
if (magic !== "SNSR") throw new Error("Invalid file format: magic");
const version = data.readUInt8(4);
if (version !== 1) throw new Error("Invalid version format: version");
const recordCount = data.readUInt16BE(5);

const records = [];
let cursor = 7;
for (let i = 0; i < recordCount; ++i) {
  const record = {};
  record.timestamp = new Date(data.readUInt32BE(cursor) * 1000);
  cursor += 4;
  record.temperature = data.readFloatBE(cursor);
  cursor += 4;
  record.sensorId = data.readUInt8(cursor);
  cursor += 1;
  records.push(record);
}

const getAverageTemp = (data) => {
  let sumTemp = 0;
  for (const record of data) {
    sumTemp += record.temperature;
  }
  return (sumTemp / recordCount).toFixed(2);
};

const getMostActive = (data) => {
    const map = new Map();
    for(const record of data){
        if(!map.has(record.sensorId)) map.set(record.sensorId, 1);
        else map.set(record.sensorId, map.get(record.sensorId) + 1);
    }
    console.log(map);
    let mostActiveCount = -Infinity;
    let mostActiveId = -Infinity;
    for(const id of map){
        if(mostActiveCount < id[1]){
            mostActiveCount = id[1];
            mostActiveId = id[0];
        }
    }
    return {mostActiveId, mostActiveCount};
}
const {mostActiveId, mostActiveCount} = getMostActive(records);
console.log(`
    File format valid (${magic} v${version})
    Records parsed: ${recordCount}
    Average temperature: ${getAverageTemp(records)}
    Most active sensor: ${mostActiveId} (${mostActiveCount} count)
`);