const mongoose = require('mongoose')
//mongoose.set('debug', true);

const MarketOrder = mongoose.Schema(
    {
        tradingsymbol: {type: String},     
        exchange: { type: String}, 
        instrument_type: { type: String},  
        price: { type: Number},   
        order_status: { type: String}, 
        qty: { type: Number}, 
        product: { type: String}, 
        trans: { type: String}, 
        source: { type: String},
        bid: { type: mongoose.Schema.ObjectId, ref: 'bots' },
        uid: { type: String }
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('market_orders', MarketOrder)