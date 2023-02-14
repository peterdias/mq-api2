const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const amqp = require("amqplib")
const Instrument = require('../models/instrument')
const StrategyModel = require('../models/strategy')
const Sequence = require('../models/sequence')
const ManageRule = require('../models/managerule')
const Bot = require('../models/bot')
const LogBot = require('../models/log_bot')
const BotTransaction = require('../models/bottransaction')
const MarketOrder = require('../models/market_order')
const MarketTrade = require('../models/market_trade')
const k8s = require('@kubernetes/client-node');
const firebaseadmin = require('../config/firebase')

const cluster = {
    name: 'do-blr1-ts-cluster',
    server: 'https://7eec650e-e675-4f03-bfe8-a0838f2c60d6.k8s.ondigitalocean.com',      
    caData: 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURKekNDQWcrZ0F3SUJBZ0lDQm5Vd0RRWUpLb1pJaHZjTkFRRUxCUUF3TXpFVk1CTUdBMVVFQ2hNTVJHbG4KYVhSaGJFOWpaV0Z1TVJvd0dBWURWUVFERXhGck9ITmhZWE1nUTJ4MWMzUmxjaUJEUVRBZUZ3MHlNakV4TURZeApNelE0TVRsYUZ3MDBNakV4TURZeE16UTRNVGxhTURNeEZUQVRCZ05WQkFvVERFUnBaMmwwWVd4UFkyVmhiakVhCk1CZ0dBMVVFQXhNUmF6aHpZV0Z6SUVOc2RYTjBaWElnUTBFd2dnRWlNQTBHQ1NxR1NJYjNEUUVCQVFVQUE0SUIKRHdBd2dnRUtBb0lCQVFEaEZNMmNwMHdoNE1Yb0ExaWZ4RVVwSTdIay9ia0JBWk9HV2ZjeEh5VUN0M01KcjhMRwp4UzVhRU9hdzlOOVhrOGxkcS82K2pIUzVxNVVoVE81SGhrQ25vU04yd1NrWnV1SEFYdVQyTUZ5OFI3NmZzUGRHCkxRRkRLOVR6aVJBRW9SSitnSEMyZXhxbnNMdTBNNCtDS1UzT04vU3J3cE9ONC8xSUhmNXFBNXM5djdab3JnWkYKcWtENzd0VlVkbFRBdWlwUUxVbm5iRi9ud0xOeGFUaWdFNFo2OFVNbXhRMHZsSFp5U3JSK3Z5enRIcVJyQnNlOQpYd1hzLy9jbHF5QmZNNFNuMjhlQnNvZW11dzFaSzN2a3VQc3MzL28yaWowOVc3UFdObGhyM1F1RDVqRk15azNGCnprK1VPcklxcTJjM3ArNDZDSHJ6Vnd3Vjl6MWF0MEpMOXdnbkFnTUJBQUdqUlRCRE1BNEdBMVVkRHdFQi93UUUKQXdJQmhqQVNCZ05WSFJNQkFmOEVDREFHQVFIL0FnRUFNQjBHQTFVZERnUVdCQlNKTkF3dFpyek5Oc2lhNzFIOQpsYVd5a2srOTd6QU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FRRUFzajRWd1paT2N6K2t1WlU3THBITGx3dk9PU2VKClN0M04vWTVmNUpHTkROUGdwaW45YVJYT0xKSm9YYWFKcnlRTVpXY2R5TVdPWlphMVo5b1hocnBMWEhuKzlZR3IKU3FiV0ZnY0IvM0l0ZzRMSEhOVU1aUTdjWS8vUVdOVkNScFg4c3hYV0dGYzFNNWVWRzd0OEpNY1RxcHpRZGN2eAppQzRKTU8ycUtvZExWZDRBU1hlQ29RNnNSZElXRUFaSVNuVmIvMkJrQTdTUVF6RHg4emJOeTRsWkozb0VZQTR3CnA3d2toUVdKaTNjek9mUTVOdnZ1ZXp2cFBKbWRRSXlGRnZNRGlwcGtyRFk5TzlvaEhoS2x6UUpFbGxnbVEzaloKV3R4NDhWOUozVVAyanJNVE9FdTlhZENIWjBnWHEvRXdEOVBsQkJPbGY4a1dDN1hkZkxiN2VXNEEvQT09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K',  
};

const user = {
    name: 'do-blr1-ts-cluster-admin',
    token: process.env.K8T 
};


const kc = new k8s.KubeConfig();
kc.loadFromClusterAndUser(cluster,user) 
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

async function sendMessageToMQ(to,msg)
{
    var connection, channel 
    try {
        connection = await amqp.connect("amqp://ts:windows2020@64.227.173.41:5672");        
        channel    = await connection.createChannel()  
        channel.assertExchange('ts','direct',{durable: false}) 
        channel.sendToQueue(to, Buffer.from(JSON.stringify(msg)));        
    } catch (error) {
        console.log(error);
        //res.status(201).json(error) 
    }
}
const pauseBot = asyncHandler(async (req, res) => {
    const { botid,uid } = req.body

    let bot = await Bot.findOne({"_id": mongoose.Types.ObjectId(botid)})

    if(bot)
    {
        if(bot.status == 1)
        {             
            sendMessageToMQ('BOT-'+botid, {action: 'PAUSE'})

            bot.status = 2
            await bot.save()
            res.status(201).json({status:'success',message:'Bot has been Paused'})
        }
        else if(bot.status == 2)
        {            
            sendMessageToMQ('BOT-'+botid, {action: 'RESUME'})

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
            k8sApi.deleteNamespacedPod('bot-'+bot.id,'default')
        }
        catch(e)
        {
            console.log(e)
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

    let pods = []
    
    try
    {
        const bres = await k8sApi.listNamespacedPod('default')    
        if(bres)
        {
            pods = bres.body.items         
        }
    }
    catch(e)
    {
        console.log(e)
    }

    let bot = null
    if(botid.substring(0,2)=='n-')
    {
        bot = await Bot.create({
            sid: mongoose.Types.ObjectId(sid),
            title: bd.title,
            execution_type: bd.execution_type,
            execution_frequency: bd.execution_frequency,
            stoploss: bd.stoploss,
            takeprofit: bd.takeprofit,
            sltp_type: bd.sltp_type,
            //trading_account: bd.trading_account,
            status: 0,
            uid: uid
        })         
    }
    else 
    {
        bot = await Bot.findOne({"_id": mongoose.Types.ObjectId(botid)})
        bot.title = bd.title
        bot.execution_type = bd.execution_type
        bot.execution_frequency = bd.execution_frequency 
        bot.stoploss= bd.stoploss
        bot.takeprofit= bd.takeprofit
        bot.sltp_type= bd.sltp_type      
        await bot.save()
    }

    if(bot)
    {
        let botfound = false         
        for(const pod of pods)
        {
            if(pod.metadata.name == 'bot-'+bot.id){
                botfound = true 
                break;
            }
        };

        if(botfound == false)
        {
            const pcontainer = new k8s.V1Container();
            pcontainer.name = 'ts'
            pcontainer.image= process.env.DO_IMAGE  
            pcontainer.env =[{name: 'BID', value : bot.id}]
            
            const resourceRequirements = new k8s.V1ResourceRequirements
            resourceRequirements.requests = {memory: '200Mi'}
            resourceRequirements.limits = {memory: '200Mi'}
            pcontainer.resources = resourceRequirements

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
        else
        {             
            sendMessageToMQ('BOT-'+botid, {action: 'UPDATE'})
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
                            strike: t.strike,
                            type: t.type,
                            qty: t.qty,
                            exchange: t.exchange,                
                            product: t.product,
                            expiry: t.expiry,
                            tradingsymbol: t.tradingsymbol,
                            stoploss: t.stoploss,
                            takeprofit: t.takeprofit,
                            tsl: t.tsl
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
                            strike: t.strike,
                            type: t.type,
                            qty: t.qty,
                            exchange: t.exchange,                
                            product: t.product,
                            expiry: t.expiry,
                            tradingsymbol: t.tradingsymbol,
                            stoploss: t.stoploss,
                            takeprofit: t.takeprofit,
                            tsl: t.tsl
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
                    et.strike= t.strike
                    et.type= t.type
                    et.qty= t.qty
                    et.exchange= t.exchange               
                    et.product= t.product
                    et.expiry= t.expiry
                    et.tradingsymbol= t.tradingsymbol
                    et.stoploss= t.stoploss
                    et.takeprofit= t.takeprofit
                    et.tsl= t.tsl
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
            uid: uid
        })        
    }
    else 
    {        
        strategy = await StrategyModel.findOne({"_id": mongoose.Types.ObjectId(st.id), "uid": uid})
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
         
        //sendMessageToMQ('BOT-'+botid, {action: 'UPDATE'})
    }

    if (strategy) { 
        res.status(201).json({status: 'success',message:'', id: strategy._id, newsequences: newsequences,newmanagerules: newmanagerules })
    } else {
        res.status(201).json({status:'error',message: 'Error saving strategy'})        
    }
})

const deleteSequence = asyncHandler(async (req, res) => {
    const { sid,sqid,uid } = req.body

    const strategy = await StrategyModel.findOne({"_id": mongoose.Types.ObjectId(sid), "uid": uid})

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

    const strategy = await StrategyModel.findOne({"_id": mongoose.Types.ObjectId(sid), "uid": uid})
    
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

    let strategies = await StrategyModel.find({"uid": uid})

    if(strategies)
    {
        res.status(201).json(strategies) 
    }
})

const getBots = asyncHandler(async (req, res) => {
    const {uid } = req.body

    let bots = await Bot.find({"uid": uid})

    if(bots)
    {
        res.status(201).json(bots) 
    }
})

const getBot = asyncHandler(async (req, res) => {
    const {uid , botid} = req.body

    let bot = await Bot.findOne({"_id":mongoose.Types.ObjectId(botid),"uid": uid})

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

    let strategy = await StrategyModel.findOne({"_id":mongoose.Types.ObjectId(sid),"uid": uid})
    
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

const getAllStrategies = asyncHandler(async (req, res) => {
    let docs = await StrategyModel.find({})
    if (docs) {
        let users = await firebaseadmin.getAllUsers()        
        console.log(users)
        res.status(201).json(docs) 
    }
    else 
    {
        res.status(400)
        throw new Error('Strategies not found')
    }
})

const getAllBots = asyncHandler(async (req, res) => {
    let docs = await Bot.find({})
    if (docs) { res.status(201).json(docs) }
    else 
    {
        res.status(400)
        throw new Error('Bots not found')
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

    let data = await MarketOrder.find({"uid": uid}).sort({createdAt:-1})

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

    let data = await MarketTrade.find({"uid": uid}).sort({createdAt:-1})

    if(data)
    {
        res.status(201).json(data) 
    }
    else 
    {
        res.status(201).json([])
    }
})

const getBotLogs = asyncHandler(async (req, res) => {
    const {bid } = req.body

    let data = await LogBot.find({"botid": mongoose.Types.ObjectId(bid)}).sort({createdAt:-1})

    if(data)
    {
        res.status(201).json(data) 
    }
    else 
    {
        res.status(201).json([])
    }
})

const getNetPositions = asyncHandler(async (req, res) => {
    const {uid } = req.body

    const Influx = require('influx');

    const influx = new Influx.InfluxDB({
        host: process.env.IDB_HOST,
        database: process.env.IDB_DATABASE2   
    });

        
    const start = new Date().toDateString();
    const trades  = await MarketTrade.find({"uid": uid, createdAt: {$gte : start }})

    const symbols = [...new Set(trades.map(item => item.tradingsymbol))];
    
    let positions = []
    for(const symbol of symbols) {
        let instrument = await Instrument.findOne({'tradingsymbol': symbol})
        
        let ltp = 0
        query = "select * from ticks where tradingsymbol='"+symbol+"' order by time desc limit 1"
        
        const rows =  await influx.query(query)
        rows.forEach(row => {
            ltp = row.ltp
        })

        let buy_count = 0
        let sell_count = 0
        let buy_qty = 0
        let sell_qty = 0
        let buy_avg_price = 0
        let sell_avg_price = 0
       
        for(const trade of trades)
        {

            if(trade.tradingsymbol== symbol)
            {
                if(trade.trans =='BUY'){
                     buy_qty+= trade.qty
                     buy_avg_price+= trade.price 
                     buy_count++
                }    
                else if(trade.trans =='SELL') {
                    sell_qty+= trade.qty
                    sell_avg_price+= trade.price 
                    sell_count++
                }
            }
        }

        if(buy_count >0) buy_avg_price= buy_avg_price / buy_count
        if(sell_count>0) sell_avg_price = sell_avg_price / sell_count
        let net_qty = buy_qty +  sell_qty
        
        let buy_mtm = (ltp - buy_avg_price) * Math.abs(buy_qty) * instrument.tick_size 
        let sell_mtm =(sell_avg_price - ltp) * Math.abs(sell_qty) * instrument.tick_size 

        let mtm = buy_mtm + sell_mtm

        positions.push({tradingsymbol: symbol, ltp:ltp , mtm: mtm,buy_avg_price:buy_avg_price,sell_avg_price: sell_avg_price, buy_qty: buy_qty, sell_qty: sell_qty, net_qty: net_qty})
    }
     
    res.status(201).json(positions)    
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
    getMarketOrders,getMarketTrades,getNetPositions,getBotLogs,
    getAllStrategies, getAllBots
}
