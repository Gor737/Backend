-- ===================== CUSTOMERS =====================

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);


-- ===================== ACCOUNTS =====================

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL
        REFERENCES customers(id),

    currency TEXT NOT NULL
        CHECK (currency IN ('AMD', 'USD', 'EUR')),

    balance BIGINT NOT NULL DEFAULT 0
        CHECK (balance >= 0),

    status TEXT NOT NULL
        CHECK (status IN ('active', 'frozen', 'closed')),

    created_at TIMESTAMP DEFAULT NOW()
);


-- ===================== TRANSACTIONS =====================

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,

    type TEXT NOT NULL
        CHECK (type IN ('deposit', 'withdraw', 'transfer')),

    from_account_id INTEGER
        REFERENCES accounts(id),

    to_account_id INTEGER
        REFERENCES accounts(id),

    amount BIGINT NOT NULL
        CHECK (amount > 0),

    reference TEXT NOT NULL UNIQUE,

    note TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    CHECK (
        (type = 'deposit'
            AND from_account_id IS NULL
            AND to_account_id IS NOT NULL)

        OR

        (type = 'withdraw'
            AND from_account_id IS NOT NULL
            AND to_account_id IS NULL)

        OR

        (type = 'transfer'
            AND from_account_id IS NOT NULL
            AND to_account_id IS NOT NULL
            AND from_account_id <> to_account_id)
    )
);


-- ===================== AUDIT LOGS =====================

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    action TEXT NOT NULL,
    meta JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);