const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/userController')

const authMiddleware = require('./middleware/authMiddleware');

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', getMe)

module.exports = router