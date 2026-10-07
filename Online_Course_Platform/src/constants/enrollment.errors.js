const enrollmentErrors = {
  NOT_FOUND: {
    statusCode: 404,
    message: "Enrollment not found",
  },
  ALREADY_ENROLLED: {
    statusCode: 409,
    message: "Student is already enrolled in this course",
  },
  OWN_COURSE: {
    statusCode: 400,
    message: "You cannot enroll in your own course",
  },
  INVALID_PROGRESS: {
    statusCode: 400,
    message: "Progress must be between 0 and 100",
  },
  NOT_OWNER: {
    statusCode: 403,
    message: "You are not owner for this course",
  },
  CANCELLED: {
    statusCode: 400,
    message: "Status is cancelled",
  },
};

module.exports = enrollmentErrors;
