const { readFile, writeFile } = require("../utils/fileDB");
const path = require("node:path");
const express = require("express");
const authorize = require("../middlewares/authorize");
const autehnticate = require("../middlewares/authenticate");
const router = express.Router();


router.get("/", async (req, res) => {
  const dataPath = path.join(__dirname, "..", "data/products.json");
  let products = await readFile(dataPath);
  const { category, sort } = req.query;
  if (category)
    products = products.filter((product) => product.category === category);
  if (sort === "price") products.sort((a, b) => a.price - b.price);

  res.json(products);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const dataPath = path.join(__dirname, "..", "data/products.json");
  const products = await readFile(dataPath);
  const product = products.find((product) => product.id === Number(id));
  if (!product) return res.status(404).json({ error: "cannot find product" });

  res.json(product);
});

router.post("/", autehnticate, authorize("admin"), async (req, res) => {
  const body = req.body;
  if (!body.name || !body.price)
    return res.status(400).json({ error: "name or price required" });
  const dataPath = path.join(__dirname, "..", "data/products.json");
  const products = await readFile(dataPath);
  const id = products.length ? products[products.length - 1].id + 1 : 1;
  const product = {
    id,
    name: body.name,
    price: body.price,
    category: body.category,
    stock: body.stock
  }
  products.push(product);

  await writeFile(dataPath, products);
  res.status(201).json({ msg: "product appended succesfully" });
});

router.put("/:id", autehnticate, authorize("admin"), async (req, res) => {
  const { id } = req.params;
  const { category, name, price, stock } = req.body;
  const dataPath = path.join(__dirname, "..", "data/products.json");
  const products = await readFile(dataPath);
  const productIdx = products.findIndex((p) => p.id === Number(id));
  if (productIdx === -1)
    return res.status(404).json({ error: "Cannot find product for updating" });

  products[productIdx] = {
    id: Number(id),
    category,
    name,
    price,
    stock,
  };

  await writeFile(dataPath, products);
  res.status(200).json({ msg: "product updated succesfully" });
});

router.patch("/:id", autehnticate, authorize("admin"), async (req, res) => {
  const { id } = req.params;
  const { category, name, price, stock } = req.body;
  const dataPath = path.join(__dirname, "..", "data/products.json");
  const products = await readFile(dataPath);
  const productIdx = products.findIndex((p) => p.id === Number(id));
  if (productIdx === -1)
    return res.status(404).json({ error: "cannot find product for updating" });

  if (category !== undefined) products[productIdx].category = category;
  if (name !== undefined) products[productIdx].name = name;
  if (price !== undefined) products[productIdx].price = price;
  if (stock !== undefined) products[productIdx].stock = stock;

  await writeFile(dataPath, products);
  res.status(200).json({ msg: "product is updated succesfully" });
});

router.delete("/:id", autehnticate, authorize("admin"), async (req, res) => {
  const { id } = req.params;
  const dataPath = path.join(__dirname, "..", "data/products.json");
  const products = await readFile(dataPath);
  const newProducts = products.filter((p) => p.id !== Number(id));
  if(products.length === newProducts.length) return res.status(404).json({error: "Cannot find product"})

  await writeFile(dataPath, newProducts);
  res.status(200).json({ msg: "product is deleted succesfully" });
});

module.exports = router;