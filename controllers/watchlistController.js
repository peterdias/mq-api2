const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const WatchList = require('../models/watchlist')
const WatchListItem = require('../models/watchlistitem')

const getList = asyncHandler(async (req, res) => {
    const { uid } = req.body

    let list = await WatchList.find({"uid": mongoose.Types.ObjectId(uid)}).populate('watchlistitems')
     
    if (list) {
        if(list.length > 0) res.status(201).json(list)
        else 
        {
            const watchlist = await WatchList.create({
                name: 'Default',           
                uid: mongoose.Types.ObjectId(uid)
            })

            if(watchlist)
            {
                list.push(watchlist)
                res.status(201).json(list)
            }
        }
    }
    else 
    {
        res.status(400)
        throw new Error('No data')
    }

    return list
})

const saveList = asyncHandler(async (req, res) => {
    const { lid,name,uid} = req.body

    if(lid == -1)
    {
        const watchlist = await WatchList.create({
            name: name,           
            uid: mongoose.Types.ObjectId(uid)
        })
        
        if (watchlist) {
            res.status(201).json({ id: watchlist._id })
        } else {
            res.status(400)
            throw new Error('Watchlist coundnt be created.')
        }
    }
    else 
    {         
        WatchList.findByIdAndUpdate(lid,{
            name: name
        },function(err, docs){
            if (err){
                res.status(400)
                throw new Error('Watchlist not Found')
            }
            else{
                res.status(201).json({status: 'watch list updated'})
            }
        })
    }
    
    return 
})

const getItems = asyncHandler(async (req, res) => {
    const { lid } = req.body

    const items = await WatchListItem.find({"lid": mongoose.Types.ObjectId(lid)})
     
    if (items) {
        res.status(201).json(items)
    }
    else 
    {
        res.status(400)
        throw new Error('No data')
    }

    return items
})

module.exports = {
    getList,
    saveList,
    getItems
}