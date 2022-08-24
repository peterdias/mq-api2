const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')

const {
    saveStrategy,
    deleteBot,
    getStrategies,
  } = require('../controllers/algoController')

  
router.post('/savestrategy',protect,saveStrategy)
router.post('/deletebot',protect,deleteBot)
router.post('/getstrategies',protect,getStrategies)

module.exports = router