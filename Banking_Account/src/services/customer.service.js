const {
  addCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomers,
} = require("../models/customers.model");

const addCustomerService = async (body) => {
  const res = await addCustomer(body);
  return res;
};

const getCustomerByIdService = async (id) => {
  const res = await getCustomerById(id);
  return res;
};

const getCustomersService = async () => {
  const res = await getCustomers();
  return res;
};

const updateCustomerService = async (id, body) => {
  const res = await updateCustomer(id, body);
  return res;
};

const deleteCustomerService = async (id) => {
  const res = await deleteCustomer(id);
  return res;
};

module.exports = {
  addCustomerService,
  getCustomerByIdService,
  getCustomersService,
  updateCustomerService,
  deleteCustomerService,
};
