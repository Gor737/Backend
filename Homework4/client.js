const net = require("node:net");
const readLine = require("node:readline");

let userName = "";
const socket = net.createConnection({
  host: "localhost",
  port: "3001",
});

socket.on("connect", () => {
  console.log("Connected to server");
  const rl = readLine.createInterface({
    input: process.stdin, 
    output: process.stdout
});
  rl.question('Enter your user name: ', (name) => {
    userName = name.trim();
    socket.write(userName + '\n');
    console.log(`Your are ${userName}`);
  })
  rl.on('line', (line) => {
    socket.write(line + '\n');
  })
});

socket.on('data', (data) => {
    process.stdout.write(data.toString());
})
