const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')

const {
    getAll   
  } = require('../controllers/watchlistController')

  
router.get('/all',protect,getAll)

module.exports = router