const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')

const {
    getList,
    saveList,
    getItems   
  } = require('../controllers/watchlistController')

  
router.post('/list',protect,getList)
router.post('/items',protect,getItems)
router.post('/savelist',protect,saveList)

module.exports = router