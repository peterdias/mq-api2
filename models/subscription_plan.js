const mongoose = require('mongoose')
//mongoose.set('debug', true);

const SubscriptionPlan = mongoose.Schema(
    {
        title: {type: String}, 
        description: {type: String}, 
        monthly: {type: Number }, 
        quarterly: {type: Number }, 
        halfyearly: {type: Number }, 
        yearly: {type: Number }, 
        trial_price: {type: Number }, 
        trial_days: {type: Number }, 
        create_strategies: { type: Number}, 
        public_strategies: {type: Number},
        deploy_strategies: { type: Number},
        live_execution: { type: Number},  
        status: { type: Number}, 
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('subscription_plans', SubscriptionPlan)