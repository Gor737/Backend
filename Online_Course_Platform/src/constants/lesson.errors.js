const lessonErrors = {
  NOT_FOUND: {
    statusCode: 404,
    message: "Lesson not found",
  },
  ORDER_EXISTS: {
    statusCode: 409,
    message: "Order already exists",
  },
  NOT_ENROLLED: {
    statusCode: 403,
    message: "Lesson not enrolled",
  },
  INVALID_DURATION: {
    statusCode: 400,
    message: "Invalid duration",
  },
  REQUIRED_FIELDS: {
    statusCode: 400, 
    message: "Fields are required"
  },
  INVALID_ORDER: {
  statusCode: 400,
  message: "Order must be greater than 0",
}
};

module.exports = lessonErrors;
