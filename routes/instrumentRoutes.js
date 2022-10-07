const express = require('express')
const router = express.Router()
const {
    getInstruments,
    getExchanges,
    getSegments,
    getInstrumentTypes,
    getTradingSymbols,
    getExpiryDates,
    getStrikes,
} = require('../controllers/instrumentController')

 
router.post('/', getInstruments)
router.post('/exchanges', getExchanges)
router.post('/segments', getSegments)
router.post('/instrument_types', getInstrumentTypes)
router.post('/tradingsymbols', getTradingSymbols)
router.post('/expiry_dates', getExpiryDates)
router.post('/strikes', getStrikes)

module.exports = router