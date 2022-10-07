const asyncHandler = require('express-async-handler')
const Instrument = require('../models/instrument')

const getExchanges = asyncHandler(async (req, res) => {
  const exchanges = await Instrument.find({}).distinct("exchange")
      
    if (exchanges) {
      res.status(201).json(exchanges)
    } else {
      res.status(400)
      throw new Error('Error fetching Exchanges')
    }
})

const getSegments= asyncHandler(async (req, res) => {
  const { exchange } = req.body
  const segments = await Instrument.find({'exchange':exchange}).distinct("segment")

  if (segments) {
      res.status(201).json(segments)
  } else {
      res.status(400)
      throw new Error('Error fetching Segments')
  }

})

const getInstrumentTypes= asyncHandler(async (req, res) => {
  const { exchange, segment} = req.body
  const instrument_types = await Instrument.find({'exchange':exchange,'segment':segment}).distinct("instrument_type")
  if (instrument_types) {
      res.status(201).json(instrument_types)
  } else {
      res.status(400)
      throw new Error('Error fetching instrument types')
  }

})

const getTradingSymbols= asyncHandler(async (req, res) => {
  const { exchange, segment,instrument_type } = req.body

  const tradingsymbols = await Instrument.find({'exchange':exchange,'segment':segment,'instrument_type':instrument_type}).distinct("tradingsymbol")

  if (tradingsymbols) {
    res.status(201).json(tradingsymbols)
} else {
    res.status(400)
    throw new Error('Error fetching trading symbols')
}


})

const getExpiryDates= asyncHandler(async (req, res) => {
  const { exchange, segment,instrument_type } = req.body

  const expiry_dates = await Instrument.find({'exchange':exchange,'segment':segment,'instrument_type':instrument_type}).distinct("expiry")

  if (expiry_dates) {
    res.status(201).json(expiry_dates.slice(0,3))
} else {
    res.status(400)
    throw new Error('Error fetching expiry dates')
}


})

const getStrikes= asyncHandler(async (req, res) => {
  const { exchange, segment,instrument_type } = req.body

  const strikes = await Instrument.find({'exchange':exchange,'segment':segment,'instrument_type':instrument_type}).distinct("strike")

  if (strikes) {
      res.status(201).json(strikes)
  } else {
      res.status(400)
      throw new Error('Error fetching strike prices')
  }
})

const getInstruments = asyncHandler(async (req, res) => {
  const { exchange, segment,search } = req.body
     
    var filter  = {}

    if(exchange == '' && segment=='' && search=='')
    {
      filter = {instrument_token: {$in : [256265,21048578,59549447,59658503,60589575,61415175,1111,2222]}}
    }
    else 
    {      
      if(search != '') {
        filter = { $or : [ { tradingsymbol: {$regex: new RegExp("^"+search),$options: "i"}}, 
                { exchange: {$regex: new RegExp("^"+search),$options: "i"}},
                { segment: {$regex: new RegExp("^"+search),$options: "i"}},
                { name: {$regex: new RegExp(search),$options: "i"}}, ] }    
      }
      else {
        if(exchange && exchange !='') filter.exchange = exchange
        if(segment && segment != '') filter.segment = segment
      }
    }
    
    //console.log(filter) 
    const instruments = await Instrument.find(filter)
     
    if (instruments) {
      res.status(201).json(instruments)
    } else {
      res.status(400)
      throw new Error('Error fetching Instruments')
    }
})


module.exports = { getInstruments,getExchanges,getSegments,getInstrumentTypes,getTradingSymbols,getStrikes, getExpiryDates}