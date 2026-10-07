const { Op, where } = require("sequelize");
const courseErrors = require("../constants/course.errors");
const { Course, User, Lesson, Enrollment } = require("../models");
const AppError = require("../utils/AppError");

const getCoursesService = async (query) => {
  const { category, level } = query;
  const options = {
    where: {
      isPublished: true,
    },
    include: [
      {
        model: User,
        as: "instructor",
        attributes: {
          exclude: ["password"],
        },
      },
    ],
  };
  if (category) options.where.category = category;
  if (level) options.where.level = level;
  const courses = await Course.findAll(options);
  return courses;
};

const getMyCoursesService = async (currentUserId) => {
  const courses = await Course.findAll({
    where: { instructorId: currentUserId },
  });

  return courses;
};

const getCourseByIdService = async (id, currentUser) => {
  let where = { [Op.and]: [{ id }] };

  if (!currentUser || currentUser?.role === "student") {
    where[Op.and].push({ isPublished: true });
  }

  if (currentUser?.role === "instructor") {
    where[Op.and].push({
      [Op.or]: [{ isPublished: true }, { instructorId: currentUser.id }],
    });
  }

  const course = await Course.findOne({
    where,
    include: [
      {
        model: User,
        as: "instructor",
        attributes: {
          exclude: ["password"],
        },
      },
      {
        model: Lesson,
        as: "lessons",
      },
    ],
  });

  if (!course)
    throw new AppError(
      courseErrors.NOT_FOUND.message,
      courseErrors.NOT_FOUND.statusCode,
    );
  return course;
};

const createCourseService = async (body, currentUser) => {
  const { title, description, category, level = "beginner", price } = body;
  const instructorId = currentUser.id;
  if (!["beginner", "intermediate", "advanced"].includes(level))
    throw new AppError(
      courseErrors.INVALID_LEVEL.message,
      courseErrors.INVALID_LEVEL.statusCode,
    );
  if (!title || !description || !category) {
    throw new AppError(
      courseErrors.REQUIRED_FIELDS.message,
      courseErrors.REQUIRED_FIELDS.statusCode,
    );
  }
  if (!Number.isFinite(Number(price)) || Number(price) < 0)
    throw new AppError(
      courseErrors.INVALID_PRICE.message,
      courseErrors.INVALID_PRICE.statusCode,
    );

  const course = await Course.create({
    title,
    description,
    category,
    level,
    price,
    instructorId,
  });

  return course;
};

const updateCourseService = async (id, body, currentUser) => {
  const course = await Course.findOne({ where: { id } });
  if (!course)
    throw new AppError(
      courseErrors.NOT_FOUND.message,
      courseErrors.NOT_FOUND.statusCode,
    );
  const { role, id: instructorId } = currentUser;

  if (role === "instructor" && course.instructorId !== instructorId)
    throw new AppError(
      courseErrors.NOT_OWNER.message,
      courseErrors.NOT_OWNER.statusCode,
    );

  const { title, description, category, level, price } = body;

  if (!["beginner", "intermediate", "advanced"].includes(level))
    throw new AppError(
      courseErrors.INVALID_LEVEL.message,
      courseErrors.INVALID_LEVEL.statusCode,
    );
  if (!title || !description || !category) {
    throw new AppError(
      courseErrors.REQUIRED_FIELDS.message,
      courseErrors.REQUIRED_FIELDS.statusCode,
    );
  }
  if (!Number.isFinite(Number(price)) || Number(price) < 0)
    throw new AppError(
      courseErrors.INVALID_PRICE.message,
      courseErrors.INVALID_PRICE.statusCode,
    );

  const updatedCourse = {
    title,
    description,
    category,
    level,
    price,
  };

  await course.update(updatedCourse);

  return course;
};

const deleteCourseService = async (id, currentUser) => {
  const course = await Course.findOne({ where: { id } });
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

  await course.destroy();
  return course;
};

const getCourseStudentsService = async (id, currentUser) => {
  const course = await Course.findOne({ where: { id } });
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

  const response = await Course.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: "students",
        through: { attributes: ["status", "progress"] },
        attributes: {
          exclude: ["password"],
        },
      },
    ],
  });

  return response.students;
};

module.exports = {
  getCoursesService,
  getMyCoursesService,
  getCourseByIdService,
  createCourseService,
  updateCourseService,
  deleteCourseService,
  getCourseStudentsService,
};
