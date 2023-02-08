const express = require('express')
const router = express.Router()

const { protect }  = require('../middleware/auth');

const {
    checkout,
    paymentVerification,
    getkey,
  } = require('../controllers/paymentController')

router.post('/checkout',protect,checkout)
router.post('/paymentverification',protect,paymentVerification)
router.post('/getkey',protect,getkey)

module.exports = router