const express = require('express')
const router = express.Router()
const { protect }  = require('../middleware/auth');

const {
    getList,
    saveList,
    getItems ,
    addItem,
    removeItem
  } = require('../controllers/watchlistController')

router.post('/list',protect,getList)
router.post('/items',protect,getItems)
router.post('/savelist',protect,saveList)
router.post('/addItem',protect,addItem)
router.post('/removeItem',protect,removeItem)

module.exports = router