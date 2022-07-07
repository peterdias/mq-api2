const asyncHandler = require('express-async-handler')
const colors = require('colors')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')

connectDB()

const Instrument = require('./models/instrument')

const getInstruments = asyncHandler(async (req, res) => {
    let search = "SILVERMIC22aug"
    let filter = { tradingsymbol: {$regex: new RegExp("^"+search),$options: "i"} }
    //filter =  { tradingsymbol: {$regex: "^"+search,$options: "i"} }
    console.log(filter)
    const instruments = await Instrument.find(filter).limit(2)
    console.log(instruments)
});

getInstruments()