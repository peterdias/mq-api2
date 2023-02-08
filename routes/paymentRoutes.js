const express = require('express')
const router = express.Router()

const { protect }  = require('../middleware/auth');

const {
    checkout,
    paymentVerification,
  } = require('../controllers/paymentController')

router.post('/checkout',protect,checkout)
router.post('/paymentverification',protect,paymentVerification)

module.exports = router