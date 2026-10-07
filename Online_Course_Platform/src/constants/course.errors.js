const courseErrors = {
  NOT_FOUND: {
    statusCode: 404,
    message: "Course not found",
  },
  NOT_OWNER: {
    statusCode: 403,
    message: "You can only modify your own courses",
  },
  NOT_PUBLISHED: {
    statusCode: 400,
    message: "Course is not published yet",
  },
  INVALID_PRICE: {
    statusCode: 400,
    message: "Invalid price",
  },
  ACTION_FORBIDDEN: {
    statusCode: 403,
    message: "You can't create course",
  },
  REQUIRED_FIELDS: {
    statusCode: 400,
    message: "Fields are required",
  },
  INVALID_LEVEL: {
    statusCode: 400,
    message: "Invalid level"
  }
};

module.exports = courseErrors;
