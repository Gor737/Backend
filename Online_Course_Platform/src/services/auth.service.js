const { User } = require("../models");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");
const userErrors = require("../constants/user.errors");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const authErrors = require("../constants/auth.errors");

const SALT = 12;

const registerService = async (body) => {
  const { fullName, email, password } = body;
  const isExistsUser = await User.findOne({ where: { email } });
  if (isExistsUser)
    throw new AppError(
      userErrors.EMAIL_EXISTS.message,
      userErrors.EMAIL_EXISTS.statusCode,
    );
  const hash = await bcrypt.hash(password, SALT);
  await User.create({ fullName, email, password: hash });
  const response = { fullName, email };
  return response;
};

const loginService = async (body) => {
  const { email, password } = body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw new AppError(
      userErrors.INVALID_CREDENTIALS.message,
      userErrors.INVALID_CREDENTIALS.statusCode,
    );

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const response = {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
  return response;
};

const getMeService = async (id) => {
  const user = await User.findOne({ where: { id } });
  if (!user)
    throw new AppError(
      userErrors.NOT_FOUND.message,
      userErrors.NOT_FOUND.statusCode,
    );
  const response = {
    fullName: user.fullName,
    email: user.email,
  };
  return response;
};

const refreshService = async (refreshToken) => {
  const { id } = verifyRefreshToken(refreshToken);
  const user = await User.findOne({ where: { id } });
  if (!user)
    throw new AppError(
      authErrors.TOKEN_INVALID.message,
      authErrors.TOKEN_INVALID.statusCode,
    );
  const accessToken = generateAccessToken(user);
  return accessToken;
};

module.exports = {
  registerService,
  loginService,
  getMeService,
  refreshService,
};
