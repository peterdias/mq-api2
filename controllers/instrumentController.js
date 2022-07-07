const asyncHandler = require('express-async-handler')
const Instrument = require('../models/instrument')
 
const getInstruments = asyncHandler(async (req, res) => {
  const { exchange, segment } = req.body
    console.log("inside getInstrumentsController")
    let filter  = {}
    if(exchange) filter.exchange = exchange
    if(segment) filter.segment = exchange
    
    const instruments = await Instrument.find(filter)

    if (instruments) {
      res.status(201).json(instruments)
    } else {
      res.status(400)
      throw new Error('Error fetching Instruments')
    }
})


module.exports = { getInstruments }