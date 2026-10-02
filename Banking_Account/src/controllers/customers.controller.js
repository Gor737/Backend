const {
  addCustomerService,
  getCustomerByIdService,
  getCustomersService,
  updateCustomerService,
  deleteCustomerService,
} = require("../services/customer.service");

const addCustomer = async (req, res, next) => {
  try {
    const body = req.body;
    const { full_name, email, phone } = body;
    if (!full_name || !email)
      return res.status(400).send({ error: "name and email are required" });
    const newCustomer = {
      full_name,
      email,
      phone: phone ? phone : null,
    };
    const response = await addCustomerService(newCustomer);
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await getCustomerByIdService(Number(id));
    if (!customer.length) return res.status(404).send({ error: "Customer Not Found" });
    res.status(200).json(customer);
  } catch (err) {
    next(err);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const customers = await getCustomersService();
    res.status(200).json(customers);
  } catch (err) {
    next(err);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await getCustomerByIdService(id);
    if (!customer.length) return res.status(404).send({ error: "Customer Not Found" });
    const { full_name, email, phone } = req.body;
    if (!full_name || !email)
      return res.status(400).send({ error: "name and email are required" });

    const updatedCustomer = {
      full_name,
      email,
      phone: phone ? phone : null,
    };

    const response = await updateCustomerService(Number(id), updateCustomer);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await getCustomerByIdService(id);
    if (!customer.length) return res.status(404).send({ error: "Customer Not Found" });
    const response = await deleteCustomerService(Number(id));
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
  deleteCustomer,
};
