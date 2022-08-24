const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')

const {
    saveStrategy,
    deleteBot,
    getStrategies,
    getStrategy,
    deleteStrategy,
    getTransactions
  } = require('../controllers/algoController')

  
router.post('/savestrategy',protect,saveStrategy)
router.post('/deletebot',protect,deleteBot)
router.post('/deletestrategy',protect,deleteStrategy)
router.post('/getstrategies',protect,getStrategies)
router.post('/getstrategy',protect,getStrategy)
router.post('/gettransactions',protect,getTransactions)
module.exports = router