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
    else if (
      item.quantity <= product.stock &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
    ) {
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    } else {
      isValid = false;
    }
  });

  if (isValid) {
    req.validOrderItems = userItems;
    next();
  } else res.status(400).json({ error: "Order items validation error" });
};

module.exports = validOrderItems;
