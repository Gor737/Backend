const net = require("node:net");

const players = [];
let gameOver = false;
const board = new Array(9).fill("_");
let currentTurn = "X";

const reset = () => {
  board.fill("_");
  players.length = 0;
  currentTurn = "X";
  gameOver = false;
};

const getPlayer = (socket) => {
  return players.find((player) => player.socket === socket);
};

const checkWinner = (board) => {
  let winner = null;
  const combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  label: for (const combination of combinations) {
    const sym = board[combination[0]];
    if (sym === "_") continue;
    for (let i = 1; i < combination.length; ++i) {
      if (board[combination[i]] !== sym) {
        continue label;
      }
    }

    winner = sym;
    break;
  }

  return winner;
};

const isFully = (board) => {
  for (const symbol of board) {
    if (symbol === "_") return false;
  }
  return true;
};

const server = net.createServer((socket) => {
  if (players.length >= 2) {
    socket.write("Server is full!\n");
    socket.end();
    return;
  }
  console.log("Player Connected");

  if (!players.length) {
    players.push({
      socket,
      symbol: "X",
    });
  } else {
    players.push({
      socket,
      symbol: "O",
    });
  }

  if (players.length === 2) {
    for (let i = 0; i < players.length; ++i) {
      players[i].socket.write(`SYMBOL|${players[i].symbol}\n`);
      players[i].socket.write(`BOARD|${board.join(",")}\n`);
      players[i].socket.write(`TURN|${currentTurn}\n`);
    }
  }
  let buffer = "";
  socket.on("data", (chunk) => {
    buffer += chunk.toString();
    let position = buffer.indexOf("\n");
    let command = "";

    while (position !== -1) {
      command = buffer.slice(0, position).trim();
      buffer = buffer.slice(position + 1);
      position = buffer.indexOf("\n");

      command = command.split("|");
      if (command[0] === "MOVE") {
        const mover = +command[1];
        if (!Number.isInteger(mover)) {
          socket.write("REJECTED|Enter a number!\n");
          continue;
        }
        const player = getPlayer(socket);
        if (player.symbol === currentTurn) {
          if (mover < 0 || mover > 8) {
            socket.write("REJECTED|Enter a valid Move\n");
            continue;
          } else if (board[mover] !== "_") {
            socket.write("REJECTED|Position was occupied\n");
            continue;
          }

          board[mover] = player.symbol;
          const winner = checkWinner(board);
          if (winner) {
            for (const player of players) {
              player.socket.write(`BOARD|${board.join(",")}\n`);
              player.socket.write(`WIN|${winner}\n`);
              player.socket.write("Game Over\n");
            }
            gameOver = true;
            break;
          } else {
            for (const player of players) {
              player.socket.write(`BOARD|${board.join(",")}\n`);
            }
            if (isFully(board)) {
              players[0].socket.write(`DRAW\n`);
              players[1].socket.write(`DRAW\n`);
              gameOver = true;
              break;
            }
            const otherPlayer = players.find((el) => el !== player);
            currentTurn = otherPlayer.symbol;
            players[0].socket.write(`TURN|${currentTurn}\n`);
            players[1].socket.write(`TURN|${currentTurn}\n`);
          }
        } else {
          socket.write("REJECTED|Not your turn!\n");
          continue;
        }
      } else {
        socket.write("REJECTED|Command not found!\n");
        continue;
      }
    }
  });

  socket.on("close", () => {
    const idx = players.findIndex((player) => player.socket === socket);

    if (idx !== -1) players.splice(idx, 1);
    if (players.length && !gameOver) players[0].socket.write("OPPONENT_LEFT\n");

    reset();

    console.log("Player disconnected!\n");
  });
});

server.listen(3001, "127.0.0.1", () => {
  console.log("Server is Running in port: 3001");
});
