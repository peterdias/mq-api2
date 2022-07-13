const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')

const {
    getAll   
  } = require('../controllers/templateController')

  
router.post('/get',protect,getTemplate)
router.post('/save',protect,saveTemplate)

module.exports = router