const express = require("express");
const { authorize, authenticate } = require("../middlewares/auth.middleware");
const { createEnrollmentController, getMyEnrollmentsController, updateEnrollmentProgressController, deleteEnrollmentController, getEnrollmentsController } = require("../controllers/enrollment.controller");

const router = express.Router();
router.use(authenticate);

// ( POST   /api/enrollments )
router.post("/", authorize('student'), createEnrollmentController);
// ( GET    /api/enrollments/me )
router.get("/me", authorize('student'), getMyEnrollmentsController);
// ( PATCH  /api/enrollments/:id/progress )
router.patch("/:id/progress", authorize('student'), updateEnrollmentProgressController);
// ( DELETE /api/enrollments/:id )
router.delete("/:id", authorize('student', 'admin'), deleteEnrollmentController);
// ( GET    /api/enrollments )
router.get("/", authorize('admin'), getEnrollmentsController);

module.exports = router;
