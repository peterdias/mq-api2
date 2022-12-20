const express = require('express')
const { protect }  = require('../middleware/auth');

const router = express.Router()

const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/userController')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', protect,getMe)

module.exports = router