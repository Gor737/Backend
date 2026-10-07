const authErrors = {
  INVALID_CREDENTIALS: {
    statusCode: 401,
    message: "Invalid email or password",
  },
  TOKEN_MISSING: {
    statusCode: 401,
    message: "Token is missing",
  },
  TOKEN_INVALID: {
    statusCode: 401,
    message: "Invalid token",
  },
  TOKEN_EXPIRED: {
    statusCode: 401,
    message: "Token has expired",
  },
  FORBIDDEN: {
    statusCode: 403,
    message: "Access forbidden",
  },
};

module.exports = authErrors;
