const userErrors = require("../constants/user.errors");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const { Course } = require("../models");
const bcrypt = require("bcryptjs");
const { getUserByIdController } = require("../controllers/user.controller");
const { where } = require("sequelize");
const SALT = 12;

const getUsersService = async (query) => {
  const { page, limit, role } = query;
  const options = {
    where: {},
    limit: 10,
    offset: 0,
    attributes: {
      exclude: ["password"],
    },
  };
  if (role) {
    if (!["student", "instructor", "admin"].includes(role)) {
      throw new AppError(
        userErrors.INVALID_ROLE.message,
        userErrors.INVALID_ROLE.statusCode,
      );
    }
    options.where.role = role;
  }
  if (limit && Number.isFinite(Number(limit)) && Number(limit) > 0)
    options.limit = Number(limit);
  if (page && Number.isFinite(Number(page)) && Number(page) > 0)
    options.offset = (Number(page) - 1) * options.limit;

  const { count, rows: users } = await User.findAndCountAll(options);
  return { count, users };
};

const getUserByIdService = async (id) => {
  const user = await User.findOne({ where: { id } });

  if (!user)
    throw new AppError(
      userErrors.NOT_FOUND.message,
      userErrors.NOT_FOUND.statusCode,
    );

  const include = [
    {
      model: Course,
      as: "enrolledCourses",
      attributes: ["id"],
    },
  ];

  if (user.role === "instructor") {
    include[0].as = "courses";
  }

  const response = await User.findOne({
    where: { id },
    attributes: {
      exclude: ["password"],
    },
    include: user.role !== "admin" ? include : [],
  });
  return response;
};

const createUserService = async (body) => {
  const { fullName, email, password, role } = body;
  const userRole = role || "student";
  if (!fullName || !email || !password)
    throw new AppError(
      userErrors.INVALID_CREDENTIALS.message,
      userErrors.INVALID_CREDENTIALS.statusCode,
    );
  const user = await User.findOne({ where: { email } });
  if (user)
    throw new AppError(
      userErrors.EMAIL_EXISTS.message,
      userErrors.EMAIL_EXISTS.statusCode,
    );
  if (!["student", "instructor", "admin"].includes(userRole))
    throw new AppError(
      userErrors.INVALID_ROLE.message,
      userErrors.INVALID_ROLE.statusCode,
    );
  const hashPassword = await bcrypt.hash(password, SALT);

  const newUser = await User.create({
    fullName,
    email,
    password: hashPassword,
    role: userRole,
  });

  const response = await User.findOne({
    where: { id: newUser.id },
    attributes: { exclude: ["password"] },
  });

  return response;
};

const updateUserRoleService = async (id, body, currentUserId) => {
  if (Number(id) === Number(currentUserId))
    throw new AppError(
      userErrors.CANNOT_CHANGE_SELF.message,
      userErrors.CANNOT_CHANGE_SELF.statusCode,
    );

  const user = await User.findOne({
    where: { id },
    attributes: { exclude: ["password"] },
  });

  if (!user)
    throw new AppError(
      userErrors.NOT_FOUND.message,
      userErrors.NOT_FOUND.statusCode,
    );

  const { role } = body;
  if (!["student", "instructor", "admin"].includes(role))
    throw new AppError(
      userErrors.INVALID_ROLE.message,
      userErrors.INVALID_ROLE.statusCode,
    );
  await user.update({
    role,
  });

  return user;
};

const deleteUserService = async (id, currentUserId) => {
  if (Number(id) === Number(currentUserId))
    throw new AppError(
      userErrors.CANNOT_DELETE_SELF.message,
      userErrors.CANNOT_DELETE_SELF.statusCode,
    );
  const user = await User.findOne({
    where: { id },
    attributes: { exclude: ["password"] },
  });
  if (!user)
    throw new AppError(
      userErrors.NOT_FOUND.message,
      userErrors.NOT_FOUND.statusCode,
    );

  await User.destroy({
    where: { id },
  });

  return user;
};

module.exports = {
  getUsersService,
  getUserByIdService,
  createUserService,
  updateUserRoleService,
  deleteUserService,
};
