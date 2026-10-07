const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const {
  authRouter,
  userRouter,
  courseRouter,
  lessonRouter,
  enrollmentRouter,
} = require("./routes");
// const

const app = express();

app.use(express.json());

//Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api", lessonRouter);
app.use("/api/enrollments", enrollmentRouter);

//Unknown route
app.use((req, res) => {
  res.status(404).send({
    success: false,
    statusCode: 404,
    message: "Route not found",
  });
});

//Errors
app.use(errorHandler);

module.exports = app;
