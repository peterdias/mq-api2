const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')

const StrategyModel = require('../models/strategy')
const BotModel = require('../models/bot')

const saveStrategy = asyncHandler(async (req, res) => {
    const { data,uid } = req.body
    let st = JSON.parse(data)  
    
    let strategy = null
    let newbots = [] 
    if(st.id.substring(0,2) == 'n-') //New Strategy
    {     
        strategy = await StrategyModel.create({
            title: st.title,    
            description: st.description,       
            uid: mongoose.Types.ObjectId(uid)
        })        
    }
    else 
    {        
        strategy = await StrategyModel.findOne({"_id": mongoose.Types.ObjectId(st.id), "uid": mongoose.Types.ObjectId(uid)})
    }

    if(strategy)
    {   
        strategy.title = st.title 
        strategy.description = st.description 
        await strategy.save() 
        
        for (const b of st.bots)
        {
            let bot = null
            if(b.id.substring(0,2) == 'n-')
            {
                bot = await BotModel.create(
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
            else 
            {
                bot = await BotModel.findOne({_id: mongoose.Types.ObjectId(b.id) })
            }

            if(bot)
            {
                bot.entry_code= b.entry_code
                bot.entry_xml= b.entry_xml
                bot.exit_code= b.exit_code
                bot.exit_xml= b.exit_xml

                await bot.save()
            }
        }
    }

    if (strategy) {            
        res.status(201).json({ id: strategy._id, newbots: newbots })
    } else {
        res.status(400)
        throw new Error('Strategy coundnt be saved')
    }

})

const deleteBot = asyncHandler(async (req, res) => {
    const { sid,botid,uid } = req.body

    const strategy = await StrategyModel.findOne({"_id": mongoose.Types.ObjectId(sid), "uid": mongoose.Types.ObjectId(uid)})

    if(strategy)
    {
        BotModel.findByIdAndRemove({'_id': mongoose.Types.ObjectId(botid)},function (err, docs) {
            if (err){
                res.status(400)
                throw new Error('Bot not Found')
            }
            else{
                res.status(201).json({status: 'Bot Removed'})
            }
        })
    }
    else 
    {
        res.status(400)
        throw new Error('Strategy not found')
    }
})

const getStrategies = asyncHandler(async (req, res) => {
    const {uid } = req.body

    let strategies = await StrategyModel.find({"uid": mongoose.Types.ObjectId(uid)})

    if(strategies)
    {
        res.status(201).json(strategies) 
    }
})

const getStrategy = asyncHandler(async (req, res) => {
    const { sid,uid } = req.body

    let strategy = await StrategyModel.findOne({"_id":mongoose.Types.ObjectId(sid),"uid": mongoose.Types.ObjectId(uid)})

    
    if(strategy)
    {
        let bots = []
        bots = await BotModel.find({"_id": mongoose.Types.ObjectId(strategy._id)})
        console.log("BOTS: ", bots.length)
        let output = {_id: strategy._id, title: strategy.title, description: strategy.description, bots: bots}
        res.status(201).json(output)
    }
    else 
    {
        res.status(201).json({status:'error',message:'Strategy Not Found'})         
    }
})

module.exports = {
    saveStrategy,
    deleteBot,
    getStrategies,
    getStrategy
}
