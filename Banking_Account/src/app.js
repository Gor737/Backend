const customerRouter = require('./routes/customers.route');
const accountRouter = require('./routes/accounts.route');
const transferRouter = require('./routes/transfers.route');
const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/customers', customerRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/transfers', transferRouter);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: err.message || "Internal Server Error"
  });
});

module.exports = app;