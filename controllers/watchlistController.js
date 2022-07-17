const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const WatchList = require('../models/watchlist')
const WatchListItem = require('../models/watchlistitem')

const getList = asyncHandler(async (req, res) => {
    const { uid } = req.body

    let list = await WatchList.find({"uid": mongoose.Types.ObjectId(uid)})
    
    const promises = list.map(async l => {
        let items = await WatchListItem.find({"lid": mongoose.Types.ObjectId(l._id)})        
        return {...l, items: items}
    })

    const nlist = await Promise.all(promises)
    console.log(nlist)
    
    // for(let l of list)
    // {
    //     let items = await WatchListItem.find({"lid": mongoose.Types.ObjectId(l._id)})
    //     l.items = items;
    //     console.log(items)
    // }

    if (list) {
        if(list.length > 0) {            
            res.status(201).json(list) 
        }
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
            throw new Error('Watchlist coundnt be created')
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

const addItem = asyncHandler(async (req, res) => {
    const { lid, exchange, tradingsymbol } = req.body

    const watchlist = await WatchList.find({"lid": mongoose.Types.ObjectId(lid)})
     
    if (watchlist) {
        const item = await WatchListItem.create({
            exchange:exchange,
            tradingsymbol: tradingsymbol,
            last: 0,
            change: 0,
            changep:0,
            lid: mongoose.Types.ObjectId(lid)
        })

        res.status(201).json(item)
    }
    else 
    {
        res.status(400)
        throw new Error('Watchlist not found')
    }

    return items
})

const removeItem = asyncHandler(async (req, res) => {
    const { lid, itemid } = req.body

    const watchlist = await WatchList.find({"lid": mongoose.Types.ObjectId(lid)})
     
    if (watchlist) {
        //const item = await WatchListItem.find({"_id": mongoose.Types.ObjectId(itemid)})
        WatchListItem.findByIdAndRemove(itemid,function (err, docs) {
            if (err){
                res.status(400)
                throw new Error('Item could not Found')
            }
            else{
                res.status(201).json({status: 'Item Removed'})
            }
        });        
    }
    else 
    {
        res.status(400)
        throw new Error('Watchlist not found')
    }

    return items
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
    getItems,
    addItem,
    removeItem
}