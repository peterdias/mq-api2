const asyncHandler = require('express-async-handler')
const { isObjectIdOrHexString } = require('mongoose')
const mongoose = require('mongoose')

const Broker = require('../models/broker')

const getBrokers = asyncHandler(async (req, res) => {
     
    const brokers = await Broker.find({})

    if (brokers) {
        res.status(201).json(brokers)
    }
    else 
    {
        res.status(400)
        throw new Error('Brokers not found')
    }
    
})

const getBroker = asyncHandler(async (req, res) => {
    const { id } = req.body

    const broker = await Broker.findOne({"_id": mongoose.Types.ObjectId(id)})

    if (broker) {
        res.status(201).json(broker)
    }
    else 
    {
        res.status(400)
        throw new Error('Broker not found')
    }
    
})


const saveBroker = asyncHandler(async (req, res) => {
    const { id, broker_code,broker_title,description,website_url,active,uid} = req.body
     
    if(id ==0)
    {        
        const broker = await Broker.create({
            broker_code,
            broker_title,
            description,
            website_url,
            active,
            uid: mongoose.Types.ObjectId(uid)
        })
        
        if (broker) {
            res.status(201).json({ id: broker._id })
        } else {
            res.status(400)
            throw new Error('Broker coundnt be saved.')
        }
    }
    else 
    {
        Broker.findByIdAndUpdate(id, {broker_code,broker_title, description, website_url,active},
            function (err, docs) {
                if (err){
                    res.status(400)
                    throw new Error('Broker not Found')
                }
                else{
                    res.status(201).json({status: 'updated'})
                }
            });
    }
    
    return 
})

module.exports = {
    getBrokers, getBroker, saveBroker
}