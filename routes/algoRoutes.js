const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')

const {
    saveStrategy,
    deleteBot,
    getStrategies,
    getStrategy
  } = require('../controllers/algoController')

  
router.post('/savestrategy',protect,saveStrategy)
router.post('/deletebot',protect,deleteBot)
router.post('/getstrategies',protect,getStrategies)
router.post('/getstrategy',protect,getStrategy)

module.exports = router