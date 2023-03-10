const express = require('express')
const { protect }  = require('../middleware/auth');

const router = express.Router()

const {
  registerUser,
  loginUser,
  getMe,
  checkFreePlan,
  getAllUsers
} = require('../controllers/userController')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', protect,getMe)
router.post('/checkfreeplan', protect,checkFreePlan)
router.post('/getallusers', protect,getAllUsers)
module.exports = router