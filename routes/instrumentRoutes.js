const express = require('express')
const router = express.Router()
const {
    getInstruments,
    getExchanges,
    getSegments,
    getInstrumentTypes,
    getExpiryDates,
    getStrikes,
} = require('../controllers/instrumentController')

 
router.post('/', getInstruments)
router.post('/exchanges', getExchanges)
router.post('/segments', getSegments)
router.post('/instrument_types', getInstrumentTypes)
router.post('/expiry_dates', getExpiryDates)
router.post('/strikes', getStrikes)

module.exports = router