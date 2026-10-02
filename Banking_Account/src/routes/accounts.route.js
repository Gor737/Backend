const express = require("express");
const {
  getAccountById,
  addAccount,
  updateAccountStatus,
  depositAccount,
  withdrawAccount,
} = require("../controllers/accounts.controller");

const router = express.Router();

router.post("/", addAccount);
router.get("/:id", getAccountById);
router.patch('/:id/status', updateAccountStatus);
router.post('/:id/deposit', depositAccount);
router.post('/:id/withdraw', withdrawAccount);

module.exports = router;
