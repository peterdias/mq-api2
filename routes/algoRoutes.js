const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')

const {
    saveStrategy
  } = require('../controllers/algoController')

  
router.post('/savestrategy',protect,saveStrategy)

module.exports = router