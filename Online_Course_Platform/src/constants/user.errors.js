const userErrors = {
  NOT_FOUND: {
    statusCode: 404,
    message: "User not found",
  },
  EMAIL_EXISTS: {
    statusCode: 409,
    message: "Email already exists",
  },
  INVALID_ROLE: {
    statusCode: 400,
    message: "Invalid role for action",
  },
  CANNOT_DELETE_SELF: {
    statusCode: 400,
    message: "Cannot delete yourself",
  },
  CANNOT_CHANGE_SELF: {
    statusCode: 400,
    message: "Cannot change yourself",
  },
  INVALID_CREDENTIALS: {
    statusCode: 400,
    message: "Invalid email and password",
  },
};

module.exports = userErrors;
