const asyncHandler = require('express-async-handler')
const colors = require('colors')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')

connectDB()

const Instrument = require('./models/instrument')

const getInstruments = asyncHandler(async (req, res) => {
    let search = "MCX-OPT"
    let filter = { $or : [ { tradingsymbol: {$regex: new RegExp("^"+search),$options: "i"}}, 
                           { exchange: {$regex: new RegExp("^"+search),$options: "i"}},
                           { segment: {$regex: new RegExp("^"+search),$options: "i"}},
                           { name: {$regex: new RegExp(search),$options: "i"}}, ] }
    //filter =  { tradingsymbol: {$regex: "^"+search,$options: "i"} }
    filter = {instrument_token: {$in : [256265,21048578,59549447,59658503,60589575,61415175]}}
    console.log(filter)
    const instruments = await Instrument.find(filter)
    console.log(instruments)
});

getInstruments()