const express = require('express')
const router = express.Router()

const { protect }  = require('../middleware/auth');

const {
    getBrokers,getBroker,saveBroker
  } = require('../controllers/adminController')


router.post('/getbrokers',protect,getBrokers)
router.post('/getbroker',protect,getBroker)
router.post('/savebroker',protect,saveBroker)

module.exports = router