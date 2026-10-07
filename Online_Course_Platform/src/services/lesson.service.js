const { where } = require("sequelize");
const courseErrors = require("../constants/course.errors");
const lessonErrors = require("../constants/lesson.errors");
const { Course, Enrollment, Lesson } = require("../models");
const AppError = require("../utils/AppError");

const getLessonsByCourseService = async (courseId, currentUser) => {
  const course = await Course.findOne({ where: { id: courseId } });
  if (!course)
    throw new AppError(
      courseErrors.NOT_FOUND.message,
      courseErrors.NOT_FOUND.statusCode,
    );
  if (
    currentUser.role === "instructor" &&
    course.instructorId !== currentUser.id
  )
    throw new AppError(
      courseErrors.NOT_OWNER.message,
      courseErrors.NOT_OWNER.statusCode,
    );
  if (currentUser.role === "student") {
    const enrollment = await Enrollment.findOne({
      where: {
        userId: currentUser.id,
        courseId,
        status: { [Op.in]: ["active", "completed"] },
      },
    });
    if (!enrollment)
      throw new AppError(
        lessonErrors.NOT_ENROLLED.message,
        lessonErrors.NOT_ENROLLED.statusCode,
      );
  }

  const lessons = await Lesson.findAll({
    where: { courseId },
    order: [["order", "ASC"]],
  });

  return lessons;
};

const getLessonByIdService = async (id, currentUser) => {
  const lesson = await Lesson.findOne({ where: { id } });
  if (!lesson)
    throw new AppError(
      lessonErrors.NOT_FOUND.message,
      lessonErrors.NOT_FOUND.statusCode,
    );
  const course = await Course.findOne({ where: { id: lesson.courseId } });
  if (!course)
    throw new AppError(
      courseErrors.NOT_FOUND.message,
      courseErrors.NOT_FOUND.statusCode,
    );
  if (
    currentUser.role === "instructor" &&
    course.instructorId !== currentUser.id
  )
    throw new AppError(
      courseErrors.NOT_OWNER.message,
      courseErrors.NOT_OWNER.statusCode,
    );

  if (currentUser.role === "student") {
    const enrollment = await Enrollment.findOne({
      where: {
        userId: currentUser.id,
        courseId: course.id,
        status: { [Op.in]: ["active", "completed"] },
      },
    });
    if (!enrollment)
      throw new AppError(
        lessonErrors.NOT_ENROLLED.message,
        lessonErrors.NOT_ENROLLED.statusCode,
      );
  }

  return lesson;
};

const createLessonService = async (courseId, body, currentUser) => {
  const course = await Course.findOne({ where: { id: courseId } });
  if (!course)
    throw new AppError(
      courseErrors.NOT_FOUND.message,
      courseErrors.NOT_FOUND.statusCode,
    );
  if (
    currentUser.role === "instructor" &&
    currentUser.id !== course.instructorId
  )
    throw new AppError(
      courseErrors.NOT_OWNER.message,
      courseErrors.NOT_OWNER.statusCode,
    );
  const { title, content, videoUrl, duration, order } = body;
  if (Number(duration) < 1)
    throw new AppError(
      lessonErrors.INVALID_DURATION.message,
      lessonErrors.INVALID_DURATION.statusCode,
    );
  if (Number(order) < 1)
    throw new AppError(
      lessonErrors.INVALID_ORDER.message,
      lessonErrors.INVALID_ORDER.statusCode,
    );
  if (!title || !content || !duration || !order)
    throw new AppError(
      lessonErrors.REQUIRED_FIELDS.message,
      lessonErrors.REQUIRED_FIELDS.statusCode,
    );


  const createdLesson = await Lesson.create({
    title,
    content,
    videoUrl,
    duration,
    order,
    courseId,
  });

  return createdLesson;
};

const updateLessonService = async (id, body, currentUser) => {
  const lesson = await Lesson.findOne({ where: { id } });
  if (!lesson)
    throw new AppError(
      lessonErrors.NOT_FOUND.message,
      lessonErrors.NOT_FOUND.statusCode,
    );
  const course = await Course.findOne({ where: { id: lesson.courseId } });
  if (!course)
    throw new AppError(
      courseErrors.NOT_FOUND.message,
      courseErrors.NOT_FOUND.statusCode,
    );

  if (
    currentUser.role === "instructor" &&
    currentUser.id !== course.instructorId
  )
    throw new AppError(
      courseErrors.NOT_OWNER.message,
      courseErrors.NOT_OWNER.statusCode,
    );
  const { title, content, videoUrl, duration, order } = body;
  if (Number(duration) < 1)
    throw new AppError(
      lessonErrors.INVALID_DURATION.message,
      lessonErrors.INVALID_DURATION.statusCode,
    );
  if (Number(order) < 1)
    throw new AppError(
      lessonErrors.INVALID_ORDER.message,
      lessonErrors.INVALID_ORDER.statusCode,
    );
  if (!title || !content || !duration || !order)
    throw new AppError(
      lessonErrors.REQUIRED_FIELDS.message,
      lessonErrors.REQUIRED_FIELDS.statusCode,
    );

  const updatedLesson = await lesson.update({
    title,
    content,
    videoUrl,
    duration,
    order
  });

  return updatedLesson;
};

const deleteLessonService = async (id, currentUser) => {
    const lesson = await Lesson.findOne({ where: { id } });
  if (!lesson)
    throw new AppError(
      lessonErrors.NOT_FOUND.message,
      lessonErrors.NOT_FOUND.statusCode,
    );
  const course = await Course.findOne({ where: { id: lesson.courseId } });
  if (!course)
    throw new AppError(
      courseErrors.NOT_FOUND.message,
      courseErrors.NOT_FOUND.statusCode,
    );

  if (
    currentUser.role === "instructor" &&
    currentUser.id !== course.instructorId
  )
    throw new AppError(
      courseErrors.NOT_OWNER.message,
      courseErrors.NOT_OWNER.statusCode,
    );
  
  await lesson.destroy();

  return lesson;
};

module.exports = {
  getLessonsByCourseService,
  getLessonByIdService,
  createLessonService,
  updateLessonService,
  deleteLessonService,
};
