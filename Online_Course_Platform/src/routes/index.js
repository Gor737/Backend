const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const courseRouter = require("./course.route");
const lessonRouter = require("./lesson.route");
const enrollmentRouter = require("./enrollment.route");

module.exports = {
  authRouter,
  userRouter,
  courseRouter,
  lessonRouter,
  enrollmentRouter,
};
