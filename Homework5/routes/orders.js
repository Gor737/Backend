const { readFile, writeFile } = require("../utils/fileDB");
const path = require("node:path");
const express = require("express");
const autehnticate = require("../middlewares/authenticate");
const validOrderItems = require("../middlewares/validOrderItems");

const router = express.Router();

router.post("/", autehnticate, validOrderItems, async (req, res) => {
  const userId = req.user.id;
  const validItems = req.validOrderItems;

  const productsPath = path.join(__dirname, "..", "data/products.json");
  const products = await readFile(productsPath);

  let total = 0;
  validItems.forEach((item) => {
    const productIdx = products.findIndex(
      (product) => product.id === Number(item.productId),
    );
    products[productIdx].stock -= item.quantity;
    total += item.unitPrice * item.quantity;
  });

  await writeFile(productsPath, products);

  const ordersPath = path.join(__dirname, "..", "data/orders.json");
  const orders = await readFile(ordersPath);

  const userOrderItems = {
    id: orders.length ? orders[orders.length - 1].id + 1 : 1,
    userId,
    items: validItems,
    total,
    createdAt: new Date().toISOString(),
  };

  orders.push(userOrderItems);
  await writeFile(ordersPath, orders);
  return res.status(201).json({ msg: "order added succesfully" });
});

router.get("/", autehnticate, async (req, res) => {
  const { id } = req.user;
  const ordersPath = path.join(__dirname, "..", "data/orders.json");
  const orders = await readFile(ordersPath);

  const userOrders = orders.filter((order) => order.userId === Number(id));

  res.status(200).json(userOrders);
});

router.get("/:id", autehnticate, async (req, res) => {
  const {id} = req.params;
  const userId = req.user.id;
  const {role} = req.user;
  const ordersPath = path.join(__dirname, "..", "data/orders.json");
  const orders = await readFile(ordersPath);

  const order = orders.find((order) => order.id === Number(id));
  if(!order) return res.status(404).json({error:"order(s) dont found"});

  if(role !== 'admin' && order.userId !== Number(userId)){
    return res.status(403).json({error:"permisson error"});
  }

  res.status(200).json(order);
});

module.exports = router;
