const http = require("node:http");
const PORT = process.env.PORT || 3000;

const notes = [];
let nextNoteId = 1;
const tasks = [];
let nextTaskId = 1;
const contacts = [];
let nextContactId = 1;

const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    "content-type": "application/json",
  });

  res.end(JSON.stringify(data));
};

const app = http.createServer((req, res) => {
  const method = req.method;
  const path = req.url;
  const [url, dynamic] = path.split("/").slice(1);

  if (url === "notes") {
    if (!dynamic) {
      switch (method) {
        case "GET":
          sendJson(res, 200, notes);
          break;
        case "POST":
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", () => {
            try {
              const data = JSON.parse(body);
              if (!data.title || !data.content) {
                return sendJson(res, 400, {
                  error: "title and content are required",
                });
              }
              const newNote = {
                id: nextNoteId++,
                title: data.title,
                content: data.content,
              };
              notes.push(newNote);
              sendJson(res, 201, newNote);
            } catch (err) {
              sendJson(res, 400, { error: "Bad request" });
            }
          });
          break;
        default:
          sendJson(res, 405, { error: "Method not allowed" });
      }
    } else {
      const id = Number(dynamic);
      switch (method) {
        case "GET":
          const note = notes.find((n) => n.id === id);
          if (!note) return sendJson(res, 404, { error: "Not Found Note" });
          sendJson(res, 200, note);
          break;
        case "PUT":
          const noteIdx = notes.findIndex((n) => n.id === id);
          if (noteIdx === -1)
            return sendJson(res, 404, { error: "Not Found Note" });
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", () => {
            try {
              const data = JSON.parse(body);
              const { title, content } = data;
              if (!data.title && !data.content)
                return sendJson(res, 400, {
                  error: "title and content are required",
                });
              const updatedNote = {
                id: notes[noteIdx].id,
                title: title ?? notes[noteIdx].title,
                content: content ?? notes[noteIdx].content,
              };
              notes[noteIdx] = updatedNote;
              sendJson(res, 200, updatedNote);
            } catch (err) {
              sendJson(res, 400, { error: "Bad request" });
            }
          });
          break;
        case "DELETE":
          const deletedNoteIdx = notes.findIndex((n) => n.id === id);
          if (deletedNoteIdx === -1)
            return sendJson(res, 404, { error: "Not Found Note" });
          notes.splice(deletedNoteIdx, 1);
          sendJson(res, 200, { msg: "Note deleted succesfully" });
          break;
        default:
          sendJson(res, 405, { error: "Method not allowed" });
      }
    }
  } else if (url === "tasks") {
    if (!dynamic) {
      switch (method) {
        case "GET":
          sendJson(res, 200, tasks);
          break;
        case "POST":
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", () => {
            try {
              const data = JSON.parse(body);
              const { title, completed } = data;
              if (!title)
                return sendJson(res, 400, { error: "title is required" });
              const newTask = {
                id: nextTaskId++,
                title,
                completed: completed ?? false,
              };
              tasks.push(newTask);
              sendJson(res, 201, newTask);
            } catch (err) {
              sendJson(res, 400, { error: "Bad request" });
            }
          });
          break;
        default:
          sendJson(res, 405, { error: "Method not allowed" });
      }
    } else {
      const id = Number(dynamic);
      switch (method) {
        case "GET":
          const task = tasks.find((t) => t.id === id);
          if (!task) return sendJson(res, 404, { error: "Task Not Found" });
          sendJson(res, 200, task);
          break;
        case "PUT":
          const taskIdx = tasks.findIndex((t) => t.id === id);
          if (taskIdx === -1)
            return sendJson(res, 404, { error: "Task Not Found" });
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", () => {
            try {
              const data = JSON.parse(body);
              const { title, completed } = data;
              if (!title && completed === undefined)
                return sendJson(res, 400, "title and completed are required");
              const updatedTask = {
                id,
                title: title ?? tasks[taskIdx].title,
                completed: completed ?? tasks[taskIdx].completed,
              };
              tasks[taskIdx] = updatedTask;
              sendJson(res, 200, updatedTask);
            } catch (err) {
              sendJson(res, 400, { error: "Bad Request" });
            }
          });
          break;
        case "DELETE":
          const deletedTaskIdx = tasks.findIndex((t) => t.id === id);
          if (deletedTaskIdx === -1)
            return sendJson(res, 404, { error: "Task not found" });
          tasks.splice(deletedTaskIdx, 1);
          sendJson(res, 200, { msg: "Task deleted succesfully" });
          break;
        default:
          sendJson(res, 405, { error: "Method not allowed" });
      }
    }
  } else if (url === "contacts") {
    if (!dynamic) {
      switch (method) {
        case "GET":
          sendJson(res, 200, contacts);
          break;
        case "POST":
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", () => {
            try {
              const data = JSON.parse(body);
              const { name, email, phone } = data;
              if (!name || !email)
                return sendJson(res, 400, {
                  error: "name and email are required",
                });
              const newContact = {
                id: nextContactId++,
                name,
                email,
                phone: phone ?? null,
              };
              contacts.push(newContact);
              sendJson(res, 201, newContact);
            } catch (err) {
              sendJson(res, 400, { error: "Bad request" });
            }
          });
          break;
        default:
          sendJson(res, 405, { error: "Method not allowed" });
      }
    } else {
      const id = Number(dynamic);
      switch (method) {
        case "GET":
          const contact = contacts.find((c) => c.id === id);
          if (!contact)
            return sendJson(res, 404, { error: "Contact not found" });
          sendJson(res, 200, contact);
          break;
        case "PUT":
          const contactIdx = contacts.findIndex((c) => c.id === id);
          if (contactIdx === -1)
            return sendJson(res, 404, { error: "Contact not found" });

          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", () => {
            try {
              const data = JSON.parse(body);
              const { name, email, phone } = data;
              if (!name && !email && !phone)
                return sendJson(res, 400, {
                  error: "name/email/phone are required",
                });
              const updatedContact = {
                id,
                name: name ?? contacts[contactIdx].name,
                email: email ?? contacts[contactIdx].email,
                phone: phone ?? contacts[contactIdx].phone,
              };
              contacts[contactIdx] = updatedContact;
              sendJson(res, 200, updatedContact);
            } catch (err) {
              sendJson(res, 400, { error: "Bad request" });
            }
          });
          break;
        case "DELETE":
          const deletedContactIdx = contacts.findIndex((c) => c.id === id);
          if (deletedContactIdx === -1)
            return sendJson(res, 404, { error: "Contact not found" });
          contacts.splice(deletedContactIdx, 1);
          sendJson(res, 200, { msg: "Contact is deleted" });
          break;
        default:
          sendJson(res, 405, { error: "Method not allowed" });
      }
    }
  } else {
    sendJson(res, 404, { error: "Page not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
