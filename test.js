const asyncHandler = require('express-async-handler')
const colors = require('colors')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')

connectDB()

const Instrument = require('./models/instrument')


const getExchanges = asyncHandler(async (req, res) => {
    const instruments = await Instrument.find({'exchange':'NFO','segment':'NFO-FUT','instrument_type':'FUT'}).distinct("tradingsymbol")
      
    console.log(instruments)
})

getExchanges()