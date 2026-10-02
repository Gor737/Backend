require('dotenv').config({quiet: true});

module.exports = {
    PORT: process.env.PORT,
    DB: {
        NAME: process.env.DB_NAME,
        USER: process.env.DB_USER,
        PASSWORD: process.env.DB_PASSWORD,
        HOST: process.env.DB_HOST,
        PORT: process.env.DB_PORT,
        DEFAULT_NAME: process.env.DB_DEFAULT_NAME
    }
}