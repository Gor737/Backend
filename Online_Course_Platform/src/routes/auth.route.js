const express = require('express');
const { getMeController, loginController, registerController, refreshController } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router()

//(GET api/auth/me)
router.get('/me', authenticate, getMeController);
//(POST api/auth/login)
router.post('/login', loginController);
//(POST api/auth/register)
router.post('/register', registerController);
//(POST /api/auth/refresh)
router.post('/refresh', refreshController);

module.exports = router;