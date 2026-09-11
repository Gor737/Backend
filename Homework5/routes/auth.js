const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { readFile, writeFile } = require("../utils/fileDB");
const router = express.Router();
const SECRET = process.env.SECRET || "secretKey";

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "username or password is required" });
  const usersPath = path.join(__dirname, "..", "data/users.json");
  const users = await readFile(usersPath);
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    username,
    passwordHash,
    role: "customer",
  };
  const haveUser = users.find((u) => u.username === username);
  if (haveUser)
    return res.status(400).json({ error: "user alredy declareyed" });

  users.push(newUser);
  await writeFile(usersPath, users);
  res.status(201).json({ id: newUser.id, username, role: newUser.role });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "username or password is required" });
  const usersPath = path.join(__dirname, "..", "data/users.json");
  const users = await readFile(usersPath);
  const haveUser = users.find((u) => u.username === username);
  if (haveUser) {
    const isCompare = await bcrypt.compare(password, haveUser.passwordHash);
    if (!isCompare)
      return res.status(401).json({ error: "username or password is wrong!" });

    const payload = {
      id: haveUser.id,
      username: haveUser.username,
      role: haveUser.role
    }
    const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });
    return res.status(200).json({ token });
  } else
    return res.status(401).json({ error: "username or password is wrong!" });
});

// router.get("/", (req, res) => {
//   const body = req.body;
//   console.log(body);
//   res.send("auth get method");
// });

// router.get("/:id", (req, res) => {
//   const { id } = req.params;
//   if (!id) return res.status(400).json({ error: "id is required" });
//   res.send("auth:id get method");
// });

// router.post("/", (req, res) => {
//   res.send("auth post method");
// });

// router.put("/:id", (req, res) => {
//   const { id } = req.params;
//   if (!id) return res.status(400).json({ error: "id is required" });
//   res.send("auth put method");
// });

// router.delete("/:id", (req, res) => {
//   const { id } = req.params;
//   if (!id) return res.status(400).json({ error: "id is required" });
//   const body = req.body;
//   console.log(body);
//   res.send("auth delete method");
// });

module.exports = router;
