const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')

const StrategyModel = require('../models/strategy')
const BotModel = require('../models/bot')

const saveStrategy = asyncHandler(async (req, res) => {
    const { data,uid } = req.body
    let st = JSON.parse(data)  
    console.log(st)  
    if(st.title.substring(0,2) == 'n-') //New Strategy
    {   console.log("222")  
        const strategy = await StrategyModel.create({
            title: st.title,    
            description: st.description,       
            uid: mongoose.Types.ObjectId(uid)
        })

        if (strategy) {
            console.log("333")  
            res.status(201).json({ id: strategy._id })
        } else {
            res.status(400)
            throw new Error('Strategy coundnt be created')
        }
    }
    else //Update Existing Strategy
    {
        console.log("444")  
        res.status(400)
        throw new Error('Strategy coundnt be updated')
    }
})

module.exports = {
    saveStrategy,
}
