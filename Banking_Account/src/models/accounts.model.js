const { getPool } = require("../config/database");

const pool = getPool();

const addAccount = async (body) => {
  const { customer_id, currency } = body;
  const { rows } = await pool.query(
    `
        INSERT INTO accounts(customer_id, currency)
        VALUES($1, $2)
        RETURNING *;   
    `,
    [customer_id, currency],
  );
  return rows[0];
};

const getAccountById = async (id) => {
  const { rows } = await pool.query(
    `
        SELECT * FROM accounts
        WHERE id = $1;
    `,
    [id],
  );
  return rows[0];
};

const updateAccountStatus = async (id, status) => {
  const { rows } = await pool.query(
    `
        UPDATE accounts SET status = $1
        WHERE id = $2
        RETURNING *;
    `,
    [status, id],
  );

  return rows[0];
};

const depositAccount = async (id, body) => {
  const client = await pool.connect();
  try {
    const { amount, reference, note } = body;
    await client.query("BEGIN");
    const { rows: row1 } = await client.query(
      `
            SELECT balance, status FROM accounts
            WHERE id = $1
            FOR UPDATE;
        `,
      [id],
    );
    if (!row1.length) throw new Error("Account not found");
    if (row1[0].status !== "active") throw new Error("Not active account");
    const { rows: row2 } = await client.query(
      `
            UPDATE accounts SET balance = balance + $1
            WHERE id = $2
            RETURNING balance;
        `,
      [amount, id],
    );

    const { rows: row3 } = await client.query(
      `
      INSERT INTO transactions (
            type,
            from_account_id,
            to_account_id,
            amount,
            reference,
            note
        )
        VALUES (
            'deposit',
            NULL,
            $1,
            $2,
            $3,
            $4
        )
        RETURNING *;  
    `,
      [id, amount, reference, note],
    );

    const action = "ACCOUNT_DEPOSIT";

    const meta = {
      account_id: id,
      amount,
      reference,
    };

    const { rows: row4 } = await client.query(
      `
        INSERT INTO audit_logs(action, meta)
        VALUES($1,$2)
        RETURNING *;
    `,
      [action, JSON.stringify(meta)],
    );

    await client.query("COMMIT");
    return row2[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const withdrawAccount = async (id, body) => {
  const client = await pool.connect();
  try {
    const { amount, reference, note } = body;
    await client.query("BEGIN");
    const { rows: row1 } = await client.query(
      `
            SELECT balance, status FROM accounts
            WHERE id = $1
            FOR UPDATE;
        `,
      [id],
    );
    if (!row1.length) throw new Error("Account not found");
    if (row1[0].status !== "active") throw new Error("Not active account");
    if(Number(row1[0].balance) < amount) throw new Error("Insufficient balance");

    const { rows: row2 } = await client.query(
      `
            UPDATE accounts SET balance = balance - $1
            WHERE id = $2
            RETURNING balance;
        `,
      [amount, id],
    );


    const { rows: row3 } = await client.query(
      `
      INSERT INTO transactions (
            type,
            from_account_id,
            to_account_id,
            amount,
            reference,
            note
        )
        VALUES (
            'withdraw',
            $1,
            NULL,
            $2,
            $3,
            $4
        )
        RETURNING *;  
    `,
      [id, amount, reference, note],
    );

    const action = "ACCOUNT_WITHDRAW";

    const meta = {
      account_id: id,
      amount,
      reference,
    };

    const { rows: row4 } = await client.query(
      `
        INSERT INTO audit_logs(action, meta)
        VALUES($1,$2)
        RETURNING *;
    `,
      [action, JSON.stringify(meta)],
    );

    await client.query("COMMIT");
    return row2[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const transferAccounts = async (fromId, toId, body) => {
    if(fromId === toId) throw new Error("Same account cannot do transfer");
    const client = await pool.connect();
  try {
    const { amount, reference, note } = body;
    await client.query("BEGIN");
    const { rows: row1 } = await client.query(
      `
            SELECT id, balance, status
            FROM accounts
            WHERE id IN ($1, $2)
            ORDER BY id
            FOR UPDATE;
        `,
      [fromId, toId],
    );
    if (row1.length !== 2) throw new Error("Account(s) not found");
    const senderAccount = row1.find(acc => acc.id === fromId);
    if (row1[0].status !== "active" || row1[1].status !== "active") throw new Error("Not active account");
    if(Number(senderAccount.balance) < amount) throw new Error("Insufficient balance");

    const { rows: sender } = await client.query(
      `
            UPDATE accounts
            SET balance = balance - $1
            WHERE id = $2
            RETURNING *;
        `,
      [amount, fromId],
    );

    const {rows: receiver} = await client.query(`
        UPDATE accounts
        SET balance = balance + $1
        WHERE id = $2
        RETURNING *;    
    `, [amount, toId]);


    const { rows: row4 } = await client.query(
      `
      INSERT INTO transactions (
            type,
            from_account_id,
            to_account_id,
            amount,
            reference,
            note
        )
        VALUES (
            'transfer',
            $1,
            $2,
            $3,
            $4,
            $5
        )
        RETURNING *;
    `,
      [fromId, toId, amount, reference, note],
    );

    const action = "ACCOUNT_TRANSFER";

    const meta = {
    from_account_id: fromId,
    to_account_id: toId,
    amount,
    reference,
    };

    const { rows: row5 } = await client.query(
      `
        INSERT INTO audit_logs(action, meta)
        VALUES ($1, $2)
        RETURNING *;
    `,
      [action, JSON.stringify(meta)],
    );

    await client.query("COMMIT");
    return {mgs: "transfer is successfully"};
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  addAccount,
  getAccountById,
  updateAccountStatus,
  depositAccount,
  withdrawAccount,
  transferAccounts
};

//========--------FOR FUTURE-------=========
// const getAccounts = async () => {
//   const { rows } = await pool.query(
//     `
//         SELECT * FROM accounts;
//     `,
//   );
//   return rows;
// };

// const updateAccount = async (id, body) => {
//   const { customer_id, currency } = body;
//   const { rows } = await pool.query(
//     `
//         UPDATE accounts
//         SET customer_id = $1, currency = $2
//         WHERE id = $3
//         RETURNING *;
//     `,
//     [customer_id, currency, id],
//   );
//   return rows[0];
// };

// const deleteAccount = async (id) => {
//   const { rows } = await pool.query(
//     `
//         DELETE FROM accounts
//         WHERE id = $1
//         RETURNING *;
//     `,
//     [id],
//   );
//   return rows[0];
// };
