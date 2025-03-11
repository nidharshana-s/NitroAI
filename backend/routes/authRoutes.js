const express = require('express');
const Upload = require('../controllers/upload');
const Chats = require('../controllers/Chats');
const router = express.Router();

const {requireAuth} = require('@clerk/express');
const UserChats = require('../controllers/UserChatsController');
const {SingleChats, UpdateChats} = require('../controllers/SingleChatsController');




// const {register, login, getProfile} = require('../controllers/authController');
// const authMiddleware = require('../middleware/authMiddleware');
// const { validateRegister, validateLogin } = require('../middleware/validation');


// // Public routes (no authentication required)
// router.post('/register', validateRegister, register);
// router.post('/login', validateLogin, login);

// // Protected route (authentication required)
// router.get('/profile', authMiddleware, getProfile);

router.get('/upload', Upload)
router.post('/chats', requireAuth(), Chats)
router.get('/test', requireAuth(), (req, res) => {
    const userId = req.auth.userId
    console.log(userId)
    console.log("first")
        res.send("success")
    })
router.get('/userchats', requireAuth(), UserChats)
router.get('/chats/:id', requireAuth(), SingleChats)
router.put('/chats/:id', requireAuth(), UpdateChats)



module.exports = router;