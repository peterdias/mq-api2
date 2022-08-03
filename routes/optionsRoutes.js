const express = require('express')
const router = express.Router()
const {
    getChain
} = require('../controllers/optionsController')

 
router.post('/chain', getChain)


module.exports = router