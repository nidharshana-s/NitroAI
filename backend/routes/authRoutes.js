const express = require('express');
const Upload = require('../controllers/upload');
const router = express.Router();


// const {register, login, getProfile} = require('../controllers/authController');
// const authMiddleware = require('../middleware/authMiddleware');
// const { validateRegister, validateLogin } = require('../middleware/validation');


// // Public routes (no authentication required)
// router.post('/register', validateRegister, register);
// router.post('/login', validateLogin, login);

// // Protected route (authentication required)
// router.get('/profile', authMiddleware, getProfile);

router.get('/upload', Upload)

module.exports = router;