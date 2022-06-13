const asyncHandler = require('express-async-handler')
const WatchList = require('../models/watchlist')

const getAll = asyncHandler(async (req, res) => {
    const list = await WatchList.find()
     
    if (list) {
        res.status(201).json(list)
    }
    else 
    {
        res.status(400)
        throw new Error('No data')
    }

    return list
})

module.exports = {
    getAll
}