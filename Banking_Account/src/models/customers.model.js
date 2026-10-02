const { getPool } = require("../config/database");

const pool = getPool();

const addCustomer = async (body) => {
  const { full_name, email, phone } = body;
  const { rows } = await pool.query(
    `
        INSERT INTO customers(full_name, email, phone)
        VALUES($1, $2, $3) RETURNING *;
    `,
    [full_name, email, phone],
  );
  return rows[0];
};

const getCustomerById = async (id) => {
  const { rows } = await pool.query(
    `
        SELECT * FROM customers
        WHERE id = $1;
    `,
    [id],
  );

  return rows;
};

const getCustomers = async () => {
  const { rows } = await pool.query(`SELECT * FROM customers;`);
  return rows;
};

const updateCustomer = async (id, body) => {
  const { full_name, email, phone } = body;
  const { rows } = await pool.query(
    `
    UPDATE customers
    SET full_name = $1, email = $2, phone = $3
    WHERE id = $4
    RETURNING *;
`,
    [full_name, email, phone, id],
  );
  return rows[0];
};

const deleteCustomer = async (id) => {
  const { rows } = await pool.query(
    `
        DELETE FROM customers
        WHERE id = $1
        RETURNING *;
    `,
    [id],
  );
  return rows[0];
};

module.exports = {
  addCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
  deleteCustomer,
};
