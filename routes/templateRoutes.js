const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')

const {
    getTemplate, 
    getTemplates, 
    saveTemplate  
  } = require('../controllers/templateController')

  
router.post('/get',protect,getTemplate)
router.post('/save',protect,saveTemplate)
router.post('/all',protect,getTemplates)

module.exports = router