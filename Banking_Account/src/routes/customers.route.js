const express = require('express');
const { addCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } = require('../controllers/customers.controller');

const router = express.Router();

router.post('/', addCustomer);
router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.patch('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;