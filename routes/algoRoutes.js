const express = require('express')
const router = express.Router()
//const { protect } = require('../middleware/authMiddleware')
const { protect }  = require('../middleware/auth');

const {
    saveStrategy,
    deleteSequence,
    getStrategies,
    getStrategy,
    deleteStrategy,
    getTransactions,
    deleteTransaction,
    deleteManageRule,
    saveBot,deleteBot,getBots,getBot,pauseBot,getMarketOrders,getMarketTrades,getNetPositions,getBotLogs,
    getAllStrategies, getAllBots, getTradingAccounts,getTradingAccount,saveTradingAccount
  } = require('../controllers/algoController')

//app.use(authMiddleware.decodeToken);

router.post('/savestrategy',protect,saveStrategy)
router.post('/deletesequence',protect,deleteSequence)
router.post('/deletemanagerule',protect,deleteManageRule)
router.post('/deletestrategy',protect,deleteStrategy)
router.post('/deletetransaction',protect,deleteTransaction)
router.post('/getstrategies',protect,getStrategies)
router.post('/getallstrategies',protect,getAllStrategies)
router.post('/getstrategy',protect,getStrategy)
router.post('/gettransactions',protect,getTransactions)
router.post('/savebot',protect,saveBot)
router.post('/deletebot',protect,deleteBot)
router.post('/getbots',protect,getBots)
router.post('/getallbots',protect,getAllBots)
router.post('/getbot',protect,getBot)
router.post('/pausebot',protect,pauseBot)
router.post('/getmarketorders',protect,getMarketOrders)
router.post('/getmarkettrades',protect,getMarketTrades)
router.post('/getnetpositions',protect,getNetPositions)
router.post('/getbotlogs',protect,getBotLogs)
router.post('/gettradingaccounts',protect,getTradingAccounts)
router.post('/gettradingaccount',protect,getTradingAccount)
router.post('/savetradingaccount',protect,saveTradingAccount)
module.exports = router