const {
  UniqueConstraintError,
  ForeignKeyConstraintError,
  ValidationError,
} = require("sequelize");
const { TokenExpiredError, JsonWebTokenError } = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).send({
      success: false,
      message: err.message,
      statusCode: err.statusCode,
    });
  } else if (err instanceof UniqueConstraintError) {
    return res.status(409).send({
      success: false,
      message: err.message,
      statusCode: 409,
    });
  } else if (err instanceof ValidationError) {
    return res.status(400).send({
      success: false,
      message: err.message,
      statusCode: 400,
    });
  } else if (err instanceof ForeignKeyConstraintError) {
    return res.status(400).send({
      success: false,
      message: err.message,
      statusCode: 400,
    });
  } else if (err instanceof TokenExpiredError) {
    return res.status(401).send({
      success: false,
      message: err.message,
      statusCode: 401,
    });
  } else if (err instanceof JsonWebTokenError) {
    return res.status(401).send({
      success: false,
      message: err.message,
      statusCode: 401,
    });
  } else {
    console.error(err);
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      statusCode: 500,
    });
  }
};

module.exports = errorHandler;
