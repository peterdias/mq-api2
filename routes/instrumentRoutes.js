const express = require('express')
const router = express.Router()
const {
    getInstruments 
} = require('../controllers/instrumentController')

 
router.post('/', getInstruments)


module.exports = router