const {
  loginService,
  registerService,
  getMeService,
  refreshService,
} = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");

const registerController = asyncHandler(async (req, res) => {
  const user = await registerService(req.body);
  const response = { fullName: user.fullName, email: user.email };
  res.status(201).send({
    success: true,
    data: response,
  });
});

const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, user } = await loginService({
    email,
    password,
  });
  res.status(200).send({
    success: true,
    data: { accessToken, refreshToken, user },
  });
});

const getMeController = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const response = await getMeService(id);
  res.status(200).send({
    success: true,
    data: response,
  });
});

const refreshController = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const accessToken = await refreshService(refreshToken);
  const response = {
    success: true,
    data: {
      accessToken,
    },
  };
  return res.status(200).send(response);
});

module.exports = {
  registerController,
  loginController,
  getMeController,
  refreshController,
};
