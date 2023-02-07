const asyncHandler = require('express-async-handler')
const Plan = require('../models/subscription_plan')

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
    const { id,title,description,
        monthly,quaterly,halfyearly,yearly ,
        trial_price,trial_days, create_strategies,public_strategies,
        deploy_strategies, live_execution, status
    } = req.body
     
    if(id ==0)
    {
        // Create Template
        const plan = await Plan.create({
            title,description,
            monthly,quaterly,halfyearly,yearly ,
            trial_price,trial_days, create_strategies,public_strategies,
            deploy_strategies, live_execution, status
        })
        
        if (plan) {
            res.status(201).json({ id: plan._id })
        } else {
            res.status(400)
            throw new Error('Subscription Plan coundnt be saved.')
        }
    }
    else 
    {
        Plan.findByIdAndUpdate(id, {
            title,description,
            monthly,quaterly,halfyearly,yearly ,
            trial_price,trial_days, create_strategies,public_strategies,
            deploy_strategies, live_execution, status
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
    savePlan
}