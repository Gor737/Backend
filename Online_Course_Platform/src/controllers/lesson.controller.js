const {
  getLessonsByCourseService,
  getLessonByIdService,
  createLessonService,
  updateLessonService,
  deleteLessonService,
} = require("../services/lesson.service");
const asyncHandler = require("../utils/asyncHandler");

const getLessonsByCourseController = asyncHandler(async (req, res) => {
  const response = await getLessonsByCourseService(req.params.courseId, req.user);
  res.status(200).send({
    success: true,
    data: response,
  });
});
const getLessonByIdController = asyncHandler(async (req, res) => {
  const response = await getLessonByIdService(req.params.id, req.user);
  res.status(200).send({
    success: true,
    data: response,
  });
});
const createLessonController = asyncHandler(async (req, res) => {
  const response = await createLessonService(
    req.params.courseId,
    req.body,
    req.user,
  );
  res.status(201).send({
    success: true,
    data: response,
  });
});
const updateLessonController = asyncHandler(async (req, res) => {
  const response = await updateLessonService(req.params.id, req.body, req.user);
  res.status(200).send({
    success: true,
    data: response,
  });
});
const deleteLessonController = asyncHandler(async (req, res) => {
  const response = await deleteLessonService(req.params.id, req.user);
  res.status(200).send({
    success: true,
    data: response,
  });
});

module.exports = {
  getLessonByIdController,
  getLessonsByCourseController,
  createLessonController,
  updateLessonController,
  deleteLessonController,
};
