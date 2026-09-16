const { readFile } = require("../utils/fileDB");
const path = require("node:path");

const validOrderItems = async (req, res, next) => {
  let isValid = true;
  const { items } = req.body;
  if (!Array.isArray(items) || !items.length)
    return res.status(400).json({ error: "items not found" });

  const productsPath = path.join(__dirname, "..", "data/products.json");
  const products = await readFile(productsPath);

  const userItems = items.map((item) => {
    const product = products.find(
      (product) => product.id === Number(item.productId),
    );
    if (!product) isValid = false;
    else {
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    }
  });

  if (!isValid)
    return res.status(400).json({ error: "Order items validation error" });

  const validUserItems = new Map();

  for (const item of userItems) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0)
      return res.status(400).json({ error: "Order items validation error" });
    if (!validUserItems.has(item.productId)) {
      validUserItems.set(item.productId, item);
    } else {
      validUserItems.set(item.productId, {
        productId: item.productId,
        quantity: item.quantity + validUserItems.get(item.productId).quantity,
        unitPrice: item.unitPrice,
      });
    }
  }

  const finalValidItems = [];
  for (const [pId, validItem] of validUserItems) {
    const product = products.find((p) => p.id === Number(pId));
    if (
      validItem.quantity > product.stock
    ) {
      return res.status(400).json({ error: "Order items validation error" });
    } else {
      finalValidItems.push(validItem);
    }
  }

  req.validOrderItems = finalValidItems;
  next();
};

module.exports = validOrderItems;
