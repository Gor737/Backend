const authErrors = require("../constants/auth.errors");
const { User } = require("../models");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { verifyAccessToken } = require("../utils/jwt");

const authenticate = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization)
    throw new AppError(
      authErrors.TOKEN_MISSING.message,
      authErrors.TOKEN_MISSING.statusCode,
    );
  const authorization = req.headers.authorization.split(" ");
  const bearer = authorization[0];
  const token = authorization[1];
  if (bearer !== "Bearer" || !token)
    throw new AppError(
      authErrors.TOKEN_INVALID.message,
      authErrors.TOKEN_INVALID.statusCode,
    );
  const { id } = verifyAccessToken(token);
  const user = await User.findOne({ where: { id } });
  if (!user)
    throw new AppError(
      authErrors.TOKEN_INVALID.message,
      authErrors.TOKEN_INVALID.statusCode,
    );
  req.user = user;
  next();
});

const authorize = (...roles) => {
  return asyncHandler((req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role))
      throw new AppError(
        authErrors.FORBIDDEN.message,
        authErrors.FORBIDDEN.statusCode,
      );
    next();
  });
};

const optionalAuthenticate = asyncHandler(async(req, res, next) => {
  if (!req.headers.authorization) return next();
  const authorization = req.headers.authorization.split(" ");
  const bearer = authorization[0];
  const token = authorization[1];
  if (bearer !== "Bearer" || !token)
    throw new AppError(
      authErrors.TOKEN_INVALID.message,
      authErrors.TOKEN_INVALID.statusCode,
    );
  const { id } = verifyAccessToken(token);
  const user = await User.findOne({ where: { id } });
  if (!user)
    throw new AppError(
      authErrors.TOKEN_INVALID.message,
      authErrors.TOKEN_INVALID.statusCode,
    );
  req.user = user;
  next();
});

module.exports = { authenticate, authorize, optionalAuthenticate };
