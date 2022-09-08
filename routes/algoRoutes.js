const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')

const {
    saveStrategy,
    deleteSequence,
    getStrategies,
    getStrategy,
    deleteStrategy,
    getTransactions,
    deleteTransaction
  } = require('../controllers/algoController')

  
router.post('/savestrategy',protect,saveStrategy)
router.post('/deletesequence',protect,deleteSequence)
router.post('/deletestrategy',protect,deleteStrategy)
router.post('/deletetransaction',protect,deleteTransaction)
router.post('/getstrategies',protect,getStrategies)
router.post('/getstrategy',protect,getStrategy)
router.post('/gettransactions',protect,getTransactions)
module.exports = router