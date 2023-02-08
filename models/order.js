const mongoose = require('mongoose')
//mongoose.set('debug', true);

const Order = mongoose.Schema(
    {
        planid: { type: mongoose.Schema.ObjectId, ref: 'subscription_plans' },
        remarks: {type: String}, 
        amount: {type: Number }, 
        frequency: {type: Number }, 
        uid: { type: String }, 
        status: { type: String}, 
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('billing_orders', Order)