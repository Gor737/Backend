# Mini E-Commerce API

A small REST API for an e-commerce application built with Node.js and Express.

## Features

- User registration and login
- JWT authentication
- Role-based authorization
- Admin product management
- Product filtering and sorting
- Order creation and checkout
- Stock validation and reduction
- User-specific order access
- JSON file storage

## Technologies

- Node.js
- Express.js
- JSON Web Token (`jsonwebtoken`)
- `bcryptjs`
- Node.js `fs` module
- dotenv

## Project Structure

```text
.
├── data/
│   ├── users.json
│   ├── products.json
│   └── orders.json
├── middlewares/
│   ├── authenticate.js
│   ├── authorize.js
│   └── validOrderItems.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   └── orders.js
├── utils/
│   └── fileDB.js
├── server.js
├── package.json
└── .env