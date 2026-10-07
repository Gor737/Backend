const {
  getCoursesService,
  getMyCoursesService,
  getCourseByIdService,
  createCourseService,
  updateCourseService,
  deleteCourseService,
  getCourseStudentsService,
} = require("../services/course.service");
const asyncHandler = require("../utils/asyncHandler");

const getCoursesController = asyncHandler(async (req, res) => {
  const courses = await getCoursesService(req.query);
  res.status(200).send({
    success: true,
    data: courses,
  });
});

const getMyCoursesController = asyncHandler(async (req, res) => {
  const courses = await getMyCoursesService(req.user.id);
  res.status(200).send({
    success: true,
    data: courses,
  });
});

const getCourseByIdController = asyncHandler(async (req, res) => {
  const course = await getCourseByIdService(req.params.id, req.user);
  res.status(200).send({
    success: true,
    data: course,
  });
});

const createCourseController = asyncHandler(async (req, res) => {
  const response = await createCourseService(req.body, req.user);
  res.status(201).send({
    success: true,
    data: response,
  });
});

const updateCourseController = asyncHandler(async (req, res) => {
  const response = await updateCourseService(req.params.id, req.body, req.user);
  res.status(200).send({
    success: true,
    data: response,
  });
});

const deleteCourseController = asyncHandler(async (req, res) => {
  const response = await deleteCourseService(req.params.id, req.user);
  res.status(200).send({
    success: true,
    data: response,
  });
});

const getCourseStudentsController = asyncHandler(async (req, res) => {
  const response = await getCourseStudentsService(req.params.id, req.user);
  res.status(200).send({
    success: true,
    data: response,
  });
});

module.exports = {
  getCoursesController,
  getMyCoursesController,
  getCourseByIdController,
  createCourseController,
  updateCourseController,
  deleteCourseController,
  getCourseStudentsController,
};
