const asyncHandler = require("../utils/asyncHandler");
const {
  getUsersService,
  getUserByIdService,
  createUserService,
  deleteUserService,
  updateUserRoleService,
} = require("../services/user.service");

const getUsersController = asyncHandler(async (req, res) => {
  const users = await getUsersService(req.query);
  res.status(200).send({
    success: true,
    data: users,
  });
});

const getUserByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await getUserByIdService(id);
  res.status(200).send({
    success: true,
    data: user,
  });
});

const createUserController = asyncHandler(async (req, res) => {
  const createdUser = await createUserService(req.body);
  res.status(201).send({
    success: true,
    data: createdUser,
  });
});

const updateUserRoleController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedUser = await updateUserRoleService(id, req.body, req.user.id);
  res.status(200).send({
    success: true,
    data: updatedUser,
  });
});

const deleteUserController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedUser = await deleteUserService(id, req.user.id);
  res.status(200).send({
    success: true,
    data: deletedUser,
  });
});

module.exports = {
  getUsersController,
  getUserByIdController,
  createUserController,
  updateUserRoleController,
  deleteUserController,
};
