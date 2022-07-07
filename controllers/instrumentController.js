const asyncHandler = require('express-async-handler')
const Instrument = require('../models/instrument')
 
const getInstruments = asyncHandler(async (req, res) => {
  const { exchange, segment,search } = req.body
     
    var filter  = {}
    if(exchange && exchange !='') filter.exchange = exchange
    if(segment && segment != '') filter.segment = segment
    if(search && search != '') {
      filter = { tradingsymbol: {$regex: new RegExp("^"+search),$options: "i"} }
      filter = 'SILVERMIC22AUGFUT'
    }

    console.log(filter)
    const instruments = await Instrument.find({filter})
     
    if (instruments) {
      res.status(201).json(instruments)
    } else {
      res.status(400)
      throw new Error('Error fetching Instruments')
    }
})


module.exports = { getInstruments }