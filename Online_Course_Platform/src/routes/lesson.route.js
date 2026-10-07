const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { getLessonsByCourseController, getLessonByIdController, createLessonController, updateLessonController, deleteLessonController } = require('../controllers/lesson.controller');

const router = express.Router();

router.use(authenticate);

// ( GET    /courses/:courseId/lessons )
router.get('/courses/:courseId/lessons', getLessonsByCourseController);
// ( GET    /lessons/:id )
router.get('/lessons/:id', getLessonByIdController);
// ( POST   /courses/:courseId/lessons )
router.post('/courses/:courseId/lessons', authorize('instructor', 'admin'), createLessonController);
// ( PUT    /lessons/:id )
router.put('/lessons/:id',  authorize('instructor', 'admin'), updateLessonController);
// ( DELETE /lessons/:id )
router.delete('/lessons/:id',  authorize('instructor', 'admin'), deleteLessonController);

module.exports = router;