const mongoose = require('mongoose')
//mongoose.set('debug', true);

const SubscriptionFeature = mongoose.Schema(
    {         
        planid: { type: mongoose.Schema.ObjectId, ref: 'subscription_plans' },         
        fkey: {type: String }, 
        name: {type: String }, 
        value: {type: Number }, 
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('subscription_prices', SubscriptionFeature)