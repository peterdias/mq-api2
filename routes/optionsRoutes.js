const express = require('express')
const router = express.Router()
const {
    getChain,
    getExpiryDates
} = require('../controllers/optionsController')

 
router.post('/chain', getChain)
router.post('/chain/expirydates', getExpiryDates)

module.exports = router