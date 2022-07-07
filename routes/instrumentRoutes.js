const express = require('express')
const router = express.Router()
const {
    getInstruments 
} = require('../controllers/instrumentController')

 
router.get('/', getInstruments)


module.exports = router