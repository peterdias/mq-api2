const express = require('express')
const router = express.Router()

const {
    getBars    
  } = require('../controllers/dataController')

router.post('/', getBars)

module.exports = router