const net = require("node:net");

const users = new Map();
const commands = new Map();

const broadcast = (msg, sender) => {
  if (msg.indexOf("\n") === -1) msg += "\n";
  for (const user of users.values()) {
    if (sender !== user) user.write(msg);
  }
};

const unicast = (msg, senderName, destName) => {
  if (msg.indexOf("\n") === -1) msg += "\n";

  users.get(destName).write(`[DM from -> ${senderName}]: ${msg}`);
  users.get(senderName).write(`[you -> ${destName}]: ${msg}`);
};

const showUsers = (socket) => {
  for (const user of users.keys()) {
    socket.write("-- " + user + "\n");
  }
};

commands.set("/msg", unicast);
commands.set("/who", showUsers);
commands.set("/exit", (sock) => sock.end());

const server = net.createServer((socket) => {
  let username = null;
  console.log("client connected");
  let buffer = "";
  socket.on("data", (chunk) => {
    buffer += chunk.toString();
    let position = null;
    while ((position = buffer.indexOf("\n")) !== -1) {
      const message = buffer.slice(0, position).trim();
      buffer = buffer.slice(position + 1);
      if (username === null) {
        if (!message) {
          socket.write("Username cant be empty: Enter again!");
        } else if (users.has(message)) {
          socket.write("Username already busy: Enter Again");
        } else {
          username = message;
          users.set(username, socket);
          broadcast(`*** ${username} joined ***`, socket);
        }
      } else {
        if (message[0] === "/") {
          const parsedCommand = {};
          const msg = message.split(" ");
          parsedCommand.command = msg[0];
          parsedCommand.username = msg[1];
          parsedCommand.message = msg.slice(2).join(" ");
          if (!commands.has(parsedCommand.command)) {
            socket.write("Invalid command!");
            continue;
          }
          const cb = commands.get(parsedCommand.command);

          if (parsedCommand.command === "/msg") {
            if (!users.has(parsedCommand.username)) {
              socket.write("User not found!");
              continue;
            }
            if (!parsedCommand.message.trim()) {
              socket.write("massege not found!");
              continue;
            }
            cb(parsedCommand.message, username, parsedCommand.username);
          } else if (parsedCommand.command === "/exit") {
            cb(socket);
          } else {
            cb(socket);
          }
        } else {
          broadcast(`[${username}]: ${message}`, socket);
        }
      }
    }
  });
  socket.on("error", (err) => console.log(err));
  socket.on("close", () => {
    if (username !== null) {
      users.delete(username);
      broadcast(`*** ${username} disconnected ***`, socket);
    }
  });
});

server.listen(3001, "localhost", () => {
  console.log("Chat app started on port 3001");
});
