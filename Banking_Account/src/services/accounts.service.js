const {
  addAccount,
  getAccountById,
  updateAccountStatus,
  depositAccount,
  withdrawAccount,
  transferAccounts,
} = require("../models/accounts.model");

const addAccountService = async (body) => {
  const res = await addAccount(body);
  return res;
};

const getAccountByIdService = async (id) => {
  const res = await getAccountById(id);
  return res;
};

const updateAccountStatusService = async (id, status) => {
  const res = await updateAccountStatus(id, status);
  return res;
};

const depositAccountService = async (id, body) => {
  const res = await depositAccount(id, body);
  return res;
};

const withdrawAccountService = async (id, body) => {
  const res = await withdrawAccount(id, body);
  return res;
};

const transferAccountsService = async (fromId, toId, body) => {
  const res = await transferAccounts(fromId, toId, body);
  return res;
};

module.exports = {
  addAccountService,
  getAccountByIdService,
  updateAccountStatusService,
  depositAccountService,
  withdrawAccountService,
  transferAccountsService,
};
