const { where } = require("sequelize");
const courseErrors = require("../constants/course.errors");
const enrollmentErrors = require("../constants/enrollment.errors");
const lessonErrors = require("../constants/lesson.errors");
const userErrors = require("../constants/user.errors");
const { Course, Enrollment, User } = require("../models");
const AppError = require("../utils/AppError");

const createEnrollmentService = async (body, currentUser) => {
  const { courseId } = body;
  const course = await Course.findOne({ where: { id: courseId } });

  if (!course)
    throw new AppError(
      courseErrors.NOT_FOUND.message,
      courseErrors.NOT_FOUND.statusCode,
    );

  if (!course.isPublished)
    throw new AppError(
      courseErrors.NOT_PUBLISHED.message,
      courseErrors.NOT_PUBLISHED.statusCode,
    );

  if (
    currentUser.role === "instructor" &&
    course.instructorId === currentUser.id
  )
    throw new AppError(
      enrollmentErrors.OWN_COURSE.message,
      enrollmentErrors.OWN_COURSE.statusCode,
    );

  const enrolled = await Enrollment.findOne({
    where: { userId: currentUser.id, courseId },
  });
  if (enrolled)
    throw new AppError(
      enrollmentErrors.ALREADY_ENROLLED.message,
      enrollmentErrors.ALREADY_ENROLLED.statusCode,
    );

  const enrollment = await Enrollment.create({
    userId: currentUser.id,
    courseId,
    status: "active",
    progress: 0,
  });

  return enrollment;
};

const getMyEnrollmentsService = async (currentUserId) => {
  const enrollments = await Enrollment.findAll({
    where: { userId: currentUserId },
    include: [
      {
        model: Course,
        include: [
          {
            model: User,
            as: "instructor",
            attributes: { exclude: ["password"] },
          },
        ],
      },
    ],
  });

  return enrollments;
};

const updateEnrollmentProgressService = async (id, body, currentUser) => {
  const enrollment = await Enrollment.findOne({ where: { id } });
  if (!enrollment)
    throw new AppError(
      enrollmentErrors.NOT_FOUND.message,
      enrollmentErrors.NOT_FOUND.statusCode,
    );
  if (enrollment.userId !== currentUser.id)
    throw new AppError(
      enrollmentErrors.NOT_OWNER.message,
      enrollmentErrors.NOT_OWNER.statusCode,
    );
  if (enrollment.status === "cancelled")
    throw new AppError(
      enrollmentErrors.CANCELLED.message,
      enrollmentErrors.CANCELLED.statusCode,
    );

  const progress = Number(body.progress);
  if (!Number.isFinite(progress) || progress < 0 || progress > 100)
    throw new AppError(
      enrollmentErrors.INVALID_PROGRESS.message,
      enrollmentErrors.INVALID_PROGRESS.statusCode,
    );

  const updatedEnrollment = await enrollment.update({
    status: progress === 100 ? "completed" : enrollment.status,
    progress,
  });

  return updatedEnrollment;
};

const deleteEnrollmentService = async (id, currentUser) => {
  const enrollment = await Enrollment.findOne({ where: { id } });
  if (!enrollment)
    throw new AppError(
      enrollmentErrors.NOT_FOUND.message,
      enrollmentErrors.NOT_FOUND.statusCode,
    );
  if (currentUser.role === "student" && enrollment.userId !== currentUser.id)
    throw new AppError(
      enrollmentErrors.NOT_OWNER.message,
      enrollmentErrors.NOT_OWNER.statusCode,
    );

  await enrollment.update({
    status: "cancelled",
  });

  return enrollment;
};

const getEnrollmentsService = async () => {
  const enrollments = await Enrollment.findAll({
    include: [
      {
        model: User,
        attributes: {exclude: ['password']}
      },
      {
        model: Course,
        include: [
          {
            model: User,
            as: 'instructor',
            attributes: { exclude: ["password"] },
          },
        ],
      },
    ],
  });

  return enrollments;
};

module.exports = {
  createEnrollmentService,
  getMyEnrollmentsService,
  updateEnrollmentProgressService,
  deleteEnrollmentService,
  getEnrollmentsService
};
