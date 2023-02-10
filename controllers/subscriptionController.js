const asyncHandler = require('express-async-handler')
const Plan = require('../models/subscription_plan')
const Order = require('../models/order')

const getCurrentPlan = asyncHandler(async (req, res) => {
    const { uid } = req.body
    
    const doc = await Order.findOne({"uid": uid}).populate('planid')
    
    if (doc) {
        let expiry = ''
        if(doc.amount > 0) {
             
            let dt = new Date(doc.startdate.toString())
            //console.log(dt)
            expiry = dt.getDate() + doc.frequency;
        }
        
        res.status(201).json({id:doc._id, 
                            plan: doc.planid.title, 
                            amount:doc.amount,
                            expirydate: expiry, 
                            frequency: doc.frequency})
    }
    else 
    {
        res.status(400)
        throw new Error('Current Plan not found')
    }
    
})

const getPlan = asyncHandler(async (req, res) => {
    const { id } = req.body
    
    const plan = await Plan.findOne({"_id": id})

    if (plan) {
        res.status(201).json(plan)
    }
    else 
    {
        res.status(400)
        throw new Error('Subscription Plan not found')
    }
    
})

const getPlans = asyncHandler(async (req, res) => {
    const { uid } = req.body     
    const plans = await Plan.find({})
     
    if (plans) {
        res.status(201).json(plans)
    }
    else 
    {
        res.status(400)
        throw new Error('Subscription Plans not found')
    }
    
})

const savePlan = asyncHandler(async (req, res) => {
    const { id,data} = req.body
    
    let bd = JSON.parse(data)  

    if(id ==0)
    {
        // Create Template
        const plan = await Plan.create({
            title: bd.title,
            description: bd.description,
            monthly:bd.monthly,
            quarterly:bd.quarterly,
            halfyearly: bd.halfyearly,
            yearly: bd.yearly ,
            trial_price: bd.trial_price,
            trial_days: bd.trial_price, 
            create_strategies: bd.create_strategies,
            public_strategies: bd.public_strategies,
            deploy_strategies: bd.deploy_strategies, 
            live_execution: bd.live_execution, status: bd.status
        })
        
        if (plan) {
            res.status(201).json({ id: plan._id , status: 'success'})
        } else {
            res.status(400)
            throw new Error('Subscription Plan coundnt be saved.')
        }
    }
    else 
    {
        Plan.findByIdAndUpdate(id, {
            title: bd.title,
            description: bd.description,
            monthly:bd.monthly,
            quaterly:bd.quaterly,
            halfyearly: bd.halfyearly,
            yearly: bd.yearly ,
            trial_price: bd.trial_price,
            trial_days: bd.trial_price, 
            create_strategies: bd.create_strategies,
            public_strategies: bd.public_strategies,
            deploy_strategies: bd.deploy_strategies, 
            live_execution: bd.live_execution, status: bd.status
        },
            function (err, docs) {
                if (err){
                    res.status(400)
                    throw new Error('Subscription Plan not Found')
                }
                else{
                    res.status(201).json({status: 'updated'})
                }
            });
    }
    
    return 
})

module.exports = {
    getPlan,
    getPlans,
    savePlan,
    getCurrentPlan
}