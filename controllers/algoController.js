const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')

const StrategyModel = require('../models/strategy')
const BotModel = require('../models/bot')

const saveStrategy = asyncHandler(async (req, res) => {
    const { data,uid } = req.body
    let st = JSON.parse(data)  
    
    if(st.id.substring(0,2) == 'n-') //New Strategy
    {   
        let newbots = []  
        const strategy = await StrategyModel.create({
            title: st.title,    
            description: st.description,       
            uid: mongoose.Types.ObjectId(uid)
        })

        if(strategy)
        {   
            for (const b of st.bots)
            {
                const bot = await BotModel.create(
                    {
                        sid: mongoose.Types.ObjectId(strategy._id),
                        entry_code: b.entry_code,
                        entry_xml: b.entry_xml,
                        exit_code: b.exit_code,
                        exit_xml: b.exit_xml
                    }
                )
                
                if(bot)
                {                    
                    newbots.push({oldid: b.id, newid: bot._id})
                }
            }
        }

        if (strategy) {            
            res.status(201).json({ id: strategy._id, newbots: newbots })
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
