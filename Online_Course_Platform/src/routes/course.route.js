const express = require('express');
const { getCoursesController, getMyCoursesController, getCourseByIdController, createCourseController, updateCourseController, deleteCourseController, getCourseStudentsController } = require('../controllers/course.controller');
const { authorize, authenticate, optionalAuthenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

// ( GET /courses )
router.get('/', getCoursesController);
// ( GET /courses/my )
router.get('/my', authenticate, authorize('instructor'), getMyCoursesController);
// ( GET /courses/:id )
router.get('/:id', optionalAuthenticate, getCourseByIdController);
// ( POST /courses )
router.post('/', authenticate, authorize('instructor', 'admin'), createCourseController);
// ( PUT /courses/:id )
router.put('/:id', authenticate, authorize('instructor', 'admin'), updateCourseController);
// ( DELETE /courses/:id )
router.delete('/:id', authenticate, authorize('instructor', 'admin'), deleteCourseController);
// ( GET /courses/:id/students )
router.get('/:id/students', authenticate, authorize('instructor', 'admin'), getCourseStudentsController)

module.exports = router;