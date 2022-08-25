const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')

const StrategyModel = require('../models/strategy')
const BotModel = require('../models/bot')
const BotTransaction = require('../models/bottransaction')

const saveStrategy = asyncHandler(async (req, res) => {
    const { data,uid } = req.body
    let st = JSON.parse(data)  
    
    let strategy = null
    let newbots = [] 
    let newtransactions = []
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
            if(b._id.substring(0,2) == 'n-')
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
                    for(const t of st.transactions)
                    {
                        const trans = await BotTransaction.create(
                            {
                                botid: mongoose.Types.ObjectId(bot._id),
                                block: t.block,
                                trans: t.trans,
                                symbol: t.symbol,
                                strike: t.strike,
                                type: t.type,
                                qty: t.qty,
                                exchange: t.exchange,                
                                product: t.product,
                                expiry: t.expiry,
                                tradingsymbol: t.tradingsymbol
                            }
                        )

                        if(trans) newtransactions.push({oldid: t._id, newid: trans._id})
                    }                   
                    newbots.push({oldid: b.id, newid: bot._id})
                }
            }
            else 
            {
                bot = await BotModel.findOne({_id: mongoose.Types.ObjectId(b._id) })
            }

            if(bot)
            {
                bot.entry_code= b.entry_code
                bot.entry_xml= b.entry_xml
                bot.exit_code= b.exit_code
                bot.exit_xml= b.exit_xml                    
                await bot.save()
                for(var t of st.transactions)
                {
                    if(t._id.substring(0,2)=='n-')//New Transaction
                    {
                        const trans = await BotTransaction.create(
                            {
                                botid: mongoose.Types.ObjectId(bot._id),
                                block: t.block,
                                trans: t.trans,
                                symbol: t.symbol,
                                strike: t.strike,
                                type: t.type,
                                qty: t.qty,
                                exchange: t.exchange,                
                                product: t.product,
                                expiry: t.expiry,
                                tradingsymbol: t.tradingsymbol
                            }
                        )

                        if(trans) newtransactions.push({oldid: t._id, newid: trans._id})
                    }
                    else //Update Transaction
                    {
                        const et = await BotTransaction.findOne({_id: mongoose.Types.ObjectId(t._id) })
                        if(et)
                        {
                            et.trans= t.trans
                            et.symbol= t.symbol
                            et.strike= t.strike
                            et.type= t.type
                            et.qty= t.qty
                            et.exchange= t.exchange               
                            et.product= t.product
                            et.expiry= t.expiry
                            et.tradingsymbol= t.tradingsymbol
                            await et.save()
                        }
                    }
                    
                }
            }
        }
    }

    if (strategy) {            
        res.status(201).json({status: 'success',message:'', id: strategy._id, newbots: newbots,newtransactions: newtransactions })
    } else {
        res.status(201).json({status:'error',message: 'Error saving strategy'})        
    }
})

const deleteBot = asyncHandler(async (req, res) => {
    const { sid,botid,uid } = req.body

    const strategy = await StrategyModel.findOne({"_id": mongoose.Types.ObjectId(sid), "uid": mongoose.Types.ObjectId(uid)})

    if(strategy)
    {
        BotModel.findByIdAndRemove({'_id': mongoose.Types.ObjectId(botid)},function (err, docs) {
            if (err){
                res.status(201).json({status:'error',message:'Bot Not found'})                
            }
            else{
                res.status(201).json({status:'success', message: 'Bot Removed'})
            }
        })
    }
    else 
    {
        res.status(400)
        throw new Error('Strategy not found')
    }
})

const deleteStrategy = asyncHandler(async (req, res) => {
    const { sid,uid } = req.body

    const strategy = await StrategyModel.findOne({"_id": mongoose.Types.ObjectId(sid), "uid": mongoose.Types.ObjectId(uid)})
    
    if(strategy)
    {
        let bots = []
        bots = await BotModel.find({"sid": mongoose.Types.ObjectId(strategy._id)})
        for(const bot of bots)
        {
            await BotTransaction.remove({"bid": mongoose.Types.ObjectId(bot._id)})
            await bot.remove()
        }

        await strategy.remove()
        res.status(201).json({status:'success',message:'Strategy has been deleted'})
    }
    else 
    {
        res.status(201).json({status:'error',message:'Strategy Not Found'}) 
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
        bots = await BotModel.find({"sid": mongoose.Types.ObjectId(strategy._id)})
        let transactions = []
        for(const bot of bots)
        {
            const trans = await BotTransaction.find({botid: mongoose.Types.ObjectId(bot._id) })
            if(trans)
            {
                trans.forEach(t=>{
                    transactions.push(t)
                })
            }
        }
        let output = {_id: strategy._id, title: strategy.title, description: strategy.description, bots: bots,transactions: transactions}
        res.status(201).json(output)
    }
    else 
    {
        res.status(201).json({status:'error',message:'Strategy Not Found'})         
    }
})

const getTransactions = asyncHandler(async (req, res) => {
    const { botid,block } = req.body

    const trans = await BotTransaction.find({"bid": mongoose.Types.ObjectId(botid),"block": block})

    if(trans)
    {
        res.status(201).json(trans)
    }
    else 
    {
        res.status(201).json([])
    }
})

module.exports = {
    saveStrategy,
    deleteBot,
    getStrategies,
    getStrategy,
    deleteStrategy,
    getTransactions
}
