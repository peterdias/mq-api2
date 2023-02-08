const asyncHandler = require('express-async-handler')
const { isObjectIdOrHexString } = require('mongoose')
const mongoose = require('mongoose')
const Order = require('../models/order')
const Invoice = require('../models/invoice')
const Payment = require('../models/payment')

const getOrder = asyncHandler(async (req, res) => {
    const { id } = req.body
    
    const doc = await Order.findOne({"_id": id})

    if (doc) {
        res.status(201).json(doc)
    }
    else 
    {
        res.status(400)
        throw new Error('Order not found')
    }    
})

const getOrders = asyncHandler(async (req, res) => {
    const { uid } = req.body
     
    const docs = await Order.find({"uid": mongoose.Types.ObjectId(uid)})     
    if (docs) { res.status(201).json(docs) }
    else 
    {
        res.status(400)
        throw new Error('Templates not found for user')
    }
    
})

const saveOrder = asyncHandler(async (req, res) => {
    const { id, data ,uid} = req.body
     
    if(id ==0)
    {
        // Create Template
        const doc = await Order.create({
            name: name,
            onchart: onchart,
            offchart: offchart,
            uid: mongoose.Types.ObjectId(uid)
        })
        
        if (doc) {
            res.status(201).json({ id: doc._id })
        } else {
            res.status(400)
            throw new Error('Order coundnt be created')
        }
    }
    else 
    {
        Order.findByIdAndUpdate(id, { name: name, onchart: onchart,offchart: offchart },
        function (err, docs) {
            if (err){
                res.status(400)
                throw new Error('Order not Found')
            }
            else{
                res.status(201).json({status: 'updated'})
            }
        });
    }
    
    return 
})

const getInvoice = asyncHandler(async (req, res) => {
    const { id } = req.body
    
    const doc = await Invoice.findOne({"_id": id})

    if (doc) {
        res.status(201).json(doc)
    }
    else 
    {
        res.status(400)
        throw new Error('Invoice not found')
    }    
})

const getInvoices = asyncHandler(async (req, res) => {
    const { uid } = req.body
     
    const docs = await Invoice.find({"uid": mongoose.Types.ObjectId(uid)})     
    if (docs) { res.status(201).json(docs) }
    else 
    {
        res.status(400)
        throw new Error('Invoices not found for user')
    }
    
})

const saveInvoice = asyncHandler(async (req, res) => {
    const { id, data ,uid} = req.body
     
    if(id ==0)
    {
        // Create Template
        const doc = await Invoice.create({
            name: name,
            onchart: onchart,
            offchart: offchart,
            uid: mongoose.Types.ObjectId(uid)
        })
        
        if (doc) {
            res.status(201).json({ id: doc._id })
        } else {
            res.status(400)
            throw new Error('Invoice coundnt be created')
        }
    }
    else 
    {
        Invoice.findByIdAndUpdate(id, { name: name, onchart: onchart,offchart: offchart },
        function (err, docs) {
            if (err){
                res.status(400)
                throw new Error('Invoice not Found')
            }
            else{
                res.status(201).json({status: 'updated'})
            }
        });
    }
    
    return 
})

module.exports = {
    getOrder,
    getOrders,
    saveOrder,
    getInvoice,
    getInvoices,
    saveInvoice
}