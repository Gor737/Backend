const express = require('express');
const { transferAccount } = require('../controllers/accounts.controller');

const router = express.Router();

router.post("/", transferAccount);

module.exports = router;