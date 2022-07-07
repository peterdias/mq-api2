const express = require('express')
const router = express.Router()
const {
    getInstruments 
} = require('../controllers/instrumentController')

console.log("in instrument routes ")
router.post('/', getInstruments)


module.exports = router