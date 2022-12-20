const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware');

const {
    getTemplate, 
    getTemplates, 
    saveTemplate  
  } = require('../controllers/templateController')

app.use(authMiddleware.decodeToken);

router.post('/get',getTemplate)
router.post('/save',saveTemplate)
router.post('/all',getTemplates)

module.exports = router