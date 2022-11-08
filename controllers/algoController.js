const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const amqp = require("amqplib")
const StrategyModel = require('../models/strategy')
const Sequence = require('../models/sequence')
const ManageRule = require('../models/managerule')
const Bot = require('../models/bot')
const BotTransaction = require('../models/bottransaction')
const MarketOrder = require('../models/market_order')
const MarketTrade = require('../models/market_trade')
const k8s = require('@kubernetes/client-node');


const pauseBot = asyncHandler(async (req, res) => {
    const { botid,uid } = req.body

    var connection, channel 
    try {
        connection = await amqp.connect("amqp://ts:windows2020@64.227.173.41:5672");        
        channel    = await connection.createChannel()  
        channel.assertExchange('ts','direct',{durable: false}) 
        //await channel.assertQueue('BOT-'+botid)
        
    } catch (error) {
        console.log(error);
        res.status(201).json(error) 
    }

    let bot = await Bot.findOne({"_id": mongoose.Types.ObjectId(botid)})

    if(bot)
    {
        if(bot.status == 1)
        {
            let c = {action: 'PAUSE'}
            channel.sendToQueue('BOT-'+botid, Buffer.from(JSON.stringify(c)));
                    
            bot.status = 2
            await bot.save()
            res.status(201).json({status:'success',message:'Bot has been Paused'})
        }
        else if(bot.status == 2)
        {
            let c = {action: 'RESUME'}
            channel.sendToQueue('BOT-'+botid, Buffer.from(JSON.stringify(c)));

            bot.status = 1
            await bot.save()
            res.status(201).json({status:'success',message:'Bot has been Resumed'})
        }
        
    }
    else 
    {
        res.status(201).json({status:'error',message:'Bot Not Found'}) 
    }
})

const deleteBot = asyncHandler(async (req, res) => {
    const { botid,uid } = req.body
   
    let bot = await Bot.findOne({"_id": mongoose.Types.ObjectId(botid)})

    if(bot)
    {
        try 
        {
            const kc = new k8s.KubeConfig();
            kc.loadFromFile('../config/kconfig');
            const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
            k8sApi.deleteNamespacedPod('bot-'+bot.id,'default')
        }
        catch(e)
        {

        }    

        let transactions = await BotTransaction.find({'botid': mongoose.Types.ObjectId(botid)})
        for(let trans of transactions)
        {
            await trans.remove()
        }

        await bot.remove()
        res.status(201).json({status:'success',message:'Bot has been deleted'})
    }
    else 
    {
        res.status(201).json({status:'error',message:'Bot Not Found'}) 
    }
})

const saveBot = asyncHandler(async (req, res) => {
    const { sid,botid,data,uid } = req.body
    
    let bd = JSON.parse(data)  
    let newtransactions = []

    const kc = new k8s.KubeConfig();
    kc.loadFromFile('./kconfig');
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const bres = await k8sApi.listNamespacedPod('default')
    let pods = []
    if(bres)
    {
        pods = bres.body.items         
    }

    let bot = null
    if(botid.substring(0,2)=='n-')
    {
        bot = await Bot.create({
            sid: mongoose.Types.ObjectId(sid),
            title: bd.title,
            execution_type: bd.execution_type,
            //trading_account: bd.trading_account,
            status: bd.status,
            uid: mongoose.Types.ObjectId(uid)
        })
         
    }
    else 
    {
        bot = await Bot.findOne({"_id": mongoose.Types.ObjectId(botid)})
        bot.title = bd.title
        bot.execution_type = bd.execution_type
        bot.status = bd.status
        await bot.save()
    }

    if(bot)
    {
        let botfound = false
        for(const pod of pods)
        {
            if(pod.metadata.name == 'BOT-'+bot.id){
                botfound = true 
                break;
            }
        };

        if(botfound == false)
        {
            const pcontainer = new k8s.V1Container();
            pcontainer.name = 'ts'
            pcontainer.image= 'registry.digitalocean.com/metaquest/ts:6967d69'
            pcontainer.env =[{name: 'BID', value : '6363668a5026731f4e001fb5'}]

            const podSpec = new k8s.V1PodSpec
            podSpec.containers = [pcontainer]

            const meta = new k8s.V1ObjectMeta
            meta.name =  "bot-"+bot.id
            meta.namespace = 'default'

            const podBody = new k8s.V1Pod
            podBody.kind = 'Pod'
            podBody.metadata= meta
            podBody.spec = podSpec
            
            k8sApi.createNamespacedPod('default',podBody)
        }

        for (const t of bd.transactions)
        {
            if(t._id.substring(0,2)=='n-')
            {
                let newtrans = null
                if(t.mrid !='')
                {
                   newtrans = await BotTransaction.create(
                        {
                            botid: mongoose.Types.ObjectId(bot._id),
                            sqid:  mongoose.Types.ObjectId(t.sqid),
                            mrid:  mongoose.Types.ObjectId(t.mrid),
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
                }
                else 
                {
                    newtrans = await BotTransaction.create(
                        {
                            botid: mongoose.Types.ObjectId(bot._id),
                            sqid:  mongoose.Types.ObjectId(t.sqid),                            
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
                }
                if(newtrans) newtransactions.push({oldid: t._id, newid: newtrans._id})
            }
            else
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

    if (bot) { 
        res.status(201).json({status: 'success',message:'', id: bot._id, newtransactions: newtransactions })
    } else {
        res.status(201).json({status:'error',message: 'Error saving bot'})        
    }
})

const saveStrategy = asyncHandler(async (req, res) => {
    const { data,uid } = req.body
    let st = JSON.parse(data)  
    
    let strategy = null
    let newsequences = [] 
    let newmanagerules = []
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
        
        for (const s of st.sequences)
        {
            let sequence = null
            if(s._id.substring(0,2) == 'n-')
            {
                sequence = await Sequence.create(
                    {
                        sid: mongoose.Types.ObjectId(strategy._id),
                        entry_code: s.entry_code,
                        entry_xml: s.entry_xml,
                        exit_code: s.exit_code,
                        exit_xml: s.exit_xml
                    }
                )
                
                if(sequence)
                {
                    for(const rule of st.managerules)
                    {                         
                        if(rule.sqid!= s._id) continue
                         
                        const newrule = await ManageRule.create({
                            sqid: mongoose.Types.ObjectId(sequence._id),
                            code: rule.code,
                            xml: rule.xml
                        })

                        if(newrule)
                        {
                            newmanagerules.push({oldid: rule._id, newid: newrule._id})                             
                        }
                    }
                               
                    newsequences.push({oldid: s._id, newid: sequence._id})
                }
            }
            else 
            {
                sequence = await Sequence.findOne({_id: mongoose.Types.ObjectId(s._id) })
                if(sequence)
                {
                    sequence.entry_code= s.entry_code
                    sequence.entry_xml= s.entry_xml
                    sequence.exit_code= s.exit_code
                    sequence.exit_xml= s.exit_xml                    
                    await sequence.save()
                    for(var rule of st.managerules)
                    {
                        if(rule.sqid!= sequence._id) continue
                        
                        if(rule._id.substring(0,2)=='n-') //New Rule
                        {
                            const newrule = await ManageRule.create({
                                sqid: mongoose.Types.ObjectId(sequence._id),
                                code: rule.code,
                                xml: rule.xml
                            })

                            if(newrule) newmanagerules.push({oldid: rule._id, newid: newrule._id})
                             
                        } 
                        else { //Update Rule
                            const er = await ManageRule.findOne({_id: mongoose.Types.ObjectId(rule._id) })
                            if(er)
                            {
                                er.code = rule.code 
                                er.xml = rule.xml 
                                await er.save()
                            }
                        }  
                    }
                     
                }
            }            
        }
        
    }

    if (strategy) {    
        //console.log(newmanagerules)        
        res.status(201).json({status: 'success',message:'', id: strategy._id, newsequences: newsequences,newmanagerules: newmanagerules })
    } else {
        res.status(201).json({status:'error',message: 'Error saving strategy'})        
    }
})

const deleteSequence = asyncHandler(async (req, res) => {
    const { sid,sqid,uid } = req.body

    const strategy = await StrategyModel.findOne({"_id": mongoose.Types.ObjectId(sid), "uid": mongoose.Types.ObjectId(uid)})

    if(strategy)
    {        
        Sequence.findByIdAndRemove({'_id': mongoose.Types.ObjectId(sqid)},function (err, docs) {
            if (err){
                res.status(201).json({status:'error',message:'Sequence Not found'})                
            }
            else{
                ManageRule.findByIdAndRemove({'sqid': mongoose.Types.ObjectId(sqid)})
                
                res.status(201).json({status:'success', message: 'Sequence Removed'})
            }
        })
    }
    else 
    {
        res.status(400)
        throw new Error('Strategy not found')
    }
})

const deleteTransaction = asyncHandler(async (req, res) => {
    const { id,uid } = req.body

    BotTransaction.findByIdAndRemove({'_id': mongoose.Types.ObjectId(id)},function (err, docs) {
        if (err){
            res.status(201).json({status:'error',message:'Transaction Not found'})                
        }
        else{
            res.status(201).json({status:'success', message: 'Transaction Removed'})
        }
    })
   
})

const deleteManageRule= asyncHandler(async (req, res) => {
    const { id,uid } = req.body

    ManageRule.findByIdAndRemove({'_id': mongoose.Types.ObjectId(id)},function (err, docs) {
        if (err){
            res.status(201).json({status:'error',message:'Manage Rule Not found'})                
        }
        else{
            res.status(201).json({status:'success', message: 'Manage Rule Removed'})
        }
    })
   
})

const deleteStrategy = asyncHandler(async (req, res) => {
    const { sid,uid } = req.body

    const strategy = await StrategyModel.findOne({"_id": mongoose.Types.ObjectId(sid), "uid": mongoose.Types.ObjectId(uid)})
    
    if(strategy)
    {
        let sequences = []
        sequences = await Sequence.find({"sid": mongoose.Types.ObjectId(strategy._id)})
        for(const sequence of sequences)
        {
            await ManageRule.remove({"sqid": mongoose.Types.ObjectId(sequence._id)})
            await sequence.remove()
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

const getBots = asyncHandler(async (req, res) => {
    const {uid } = req.body

    let bots = await Bot.find({"uid": mongoose.Types.ObjectId(uid)})

    if(bots)
    {
        res.status(201).json(bots) 
    }
})

const getBot = asyncHandler(async (req, res) => {
    const {uid , botid} = req.body

    let bot = await Bot.findOne({"_id":mongoose.Types.ObjectId(botid),"uid": mongoose.Types.ObjectId(uid)})

    if(bot)
    {
        res.status(201).json(bot) 
    }
    // else 
    // {

    // }
})

const getStrategy = asyncHandler(async (req, res) => {
    const { sid,uid } = req.body

    let strategy = await StrategyModel.findOne({"_id":mongoose.Types.ObjectId(sid),"uid": mongoose.Types.ObjectId(uid)})

    
    if(strategy)
    {
        let sequences = []
        sequences = await Sequence.find({"sid": mongoose.Types.ObjectId(strategy._id)})
        let manage_rules = []
        for(const sequence of sequences)
        {
            const rules = await ManageRule.find({sqid: mongoose.Types.ObjectId(sequence._id) })
            if(rules.length > 0) 
            {
                rules.forEach(r => {
                    manage_rules.push(r)
                })
            }            
        }
        let output = {_id: strategy._id, title: strategy.title, description: strategy.description, sequences: sequences,managerules: manage_rules}
        res.status(201).json(output)
    }
    else 
    {
        res.status(201).json({status:'error',message:'Strategy Not Found'})         
    }
})

const getTransactions = asyncHandler(async (req, res) => {
    const { botid,uid } = req.body

    const trans = await BotTransaction.find({"botid": mongoose.Types.ObjectId(botid)})

    if(trans)
    {
        res.status(201).json(trans)
    }
    else 
    {
        res.status(201).json([])
    }
})

const getMarketOrders = asyncHandler(async (req, res) => {
    const {uid } = req.body

    let data = await MarketOrder.find()

    if(data)
    {
        res.status(201).json(data) 
    }
    else 
    {
        res.status(201).json([])
    }
})

const getMarketTrades = asyncHandler(async (req, res) => {
    const {uid } = req.body

    let data = await MarketTrade.find()

    if(data)
    {
        res.status(201).json(data) 
    }
    else 
    {
        res.status(201).json([])
    }
})

module.exports = {
    saveStrategy,
    deleteSequence,
    getStrategies,
    getStrategy,
    deleteStrategy,
    getTransactions,
    deleteTransaction,
    deleteManageRule,
    saveBot,
    deleteBot,getBots,getBot,pauseBot,
    getMarketOrders,getMarketTrades
}
