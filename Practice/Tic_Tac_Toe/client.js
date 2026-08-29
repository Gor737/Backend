const net = require("node:net");
const readLine = require("node:readline");

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let gameOver = false;

const renderBoard = (board) => {
  const cells = board.split(",");
  let res = "";
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      const sym = cells[i * 3 + j];
      if (sym !== "_") res += sym;
      else res += ".";

      if (j !== 2) res += " | ";
    }
    if (i !== 2) res += "\n-------------\n";
    else res += "\n";
  }

  return res;
};

const client = net.createConnection(3001, "127.0.0.1", () => {
  let buffer = "";
  let mySymbol = null;
  let board = null;
  let currentTurn = null;
  let movePending = false;

  client.on("data", (chunk) => {
    buffer += chunk.toString();
    let position = buffer.indexOf("\n");
    while (position !== -1) {
      const msg = buffer.slice(0, position);
      buffer = buffer.slice(position + 1);
      position = buffer.indexOf("\n");

      const parsed = msg.split("|");
      if (parsed[0] === "SYMBOL") {
        mySymbol = parsed[1];
        process.stdout.write(`My Symbol: ${parsed[1]}\n`);
      } else if (parsed[0] === "BOARD") {
        board = parsed[1];
        process.stdout.write(renderBoard(board));
      } else if (parsed[0] === "TURN") {
        movePending = false;
        currentTurn = parsed[1];
        if (parsed[1] === mySymbol) {
          process.stdout.write("My turn\n");
        } else {
          process.stdout.write(`Opponent's turn\n`);
        }
      } else if (parsed[0] === "WIN") {
        gameOver = true;
        movePending = false;
        process.stdout.write(`${parsed[1]} Won\n`);
        rl.close();
        client.end();
      } else if (parsed[0] === "DRAW") {
        gameOver = true;
        movePending = false;
        rl.close();
        client.end();
        process.stdout.write("Game ended in a draw\n");
      } else if (parsed[0] === "OPPONENT_LEFT") {
        gameOver = true;
        process.stdout.write("Opponent disconnected\n");
        rl.close();
        client.end();
      } else if (parsed[0] === "REJECTED") {
        movePending = false;
        process.stdout.write(parsed[1] + '\n');
      }else{
        process.stdout.write(parsed[0] + '\n');
      }
    }
  });

  rl.on("line", (input) => {
    if (currentTurn === mySymbol && !gameOver && !movePending) {
      const command = `MOVE|${input}\n`;
      client.write(command);
    }
  });
});

client.on("connect", () => {
  console.log("Player(You) connected to Server\n");
});

client.on('close', () => {
    console.log('Disconnected from server!\n');
})
