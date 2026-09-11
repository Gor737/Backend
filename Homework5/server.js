const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();
//Routes
const authRouter = require("./routes/auth");
const productRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const { readFile, writeFile } = require("./utils/fileDB");

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/orders', ordersRouter);

// async function test(path = './data/test.json') {
//   const data = await readFile(path);
//   console.log(data);
//   data.push({name: "Nelly"});
//   await writeFile(path, data);
//   const updated = await readFile(path);
//   console.log(updated);
// }
// test()


app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});



//===================----

//bcrypt hashing for testing

// const hashing = async (pass) => {
//   const hash = await bcrypt.hash(pass, 10);
//   return hash;
// }

// hashing("gracias").then(d => console.log(d));

