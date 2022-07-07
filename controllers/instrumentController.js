const asyncHandler = require('express-async-handler')
const Instrument = require('../models/instrument')
 
const getInstruments = asyncHandler(async (req, res) => {
  const { exchange, segment,search } = req.body
     
    var filter  = {}
    if(exchange && exchange !='') filter.exchange = exchange
    if(segment && segment != '') filter.segment = segment
    if(search && search != '') {
      filter = { tradingsymbol: {$regex: new RegExp("^"+search),$options: "i"} }
      filter = {tradingsymbol: 'SILVERMIC22AUGFUT'}
    }

    console.log(filter)
    const instruments = await Instrument.find({tradingsymbol: 'SILVERMIC22AUGFUT'})
    console.log(instruments.length)
    if (instruments) {
      res.status(201).json(instruments)
    } else {
      res.status(400)
      throw new Error('Error fetching Instruments')
    }
})


module.exports = { getInstruments }