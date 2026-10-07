const express = require("express");
const {
  getUsersController,
  getUserByIdController,
  updateUserRoleController,
  deleteUserController,
  createUserController,
} = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();
router.use(authenticate);
router.use(authorize('admin'));

// ( GET /users )
router.get("/", getUsersController);
// ( GET /users/:id )
router.get("/:id", getUserByIdController);
// ( PATCH /users/:id/role )
router.patch("/:id/role", updateUserRoleController);
// ( DELETE /users/:id )
router.delete("/:id", deleteUserController);

//( POST /users )  --> Optional
router.post("/", createUserController);

module.exports = router;
