const express = require('express')
const router = express.Router()
//const { protect } = require('../middleware/authMiddleware')
const authMiddleware = require('../middleware/authMiddleware');

const {
    saveStrategy,
    deleteSequence,
    getStrategies,
    getStrategy,
    deleteStrategy,
    getTransactions,
    deleteTransaction,
    deleteManageRule,
    saveBot,deleteBot,getBots,getBot,pauseBot,getMarketOrders,getMarketTrades,getNetPositions,getBotLogs
  } = require('../controllers/algoController')

app.use(authMiddleware.decodeToken);

router.post('/savestrategy',protect,saveStrategy)
router.post('/deletesequence',deleteSequence)
router.post('/deletemanagerule',deleteManageRule)
router.post('/deletestrategy',deleteStrategy)
router.post('/deletetransaction',deleteTransaction)
router.post('/getstrategies',getStrategies)
router.post('/getstrategy',getStrategy)
router.post('/gettransactions',getTransactions)
router.post('/savebot',saveBot)
router.post('/deletebot',deleteBot)
router.post('/getbots',getBots)
router.post('/getbot',getBot)
router.post('/pausebot',pauseBot)
router.post('/getmarketorders',getMarketOrders)
router.post('/getmarkettrades',getMarketTrades)
router.post('/getnetpositions',getNetPositions)
router.post('/getbotlogs',getBotLogs)
module.exports = router