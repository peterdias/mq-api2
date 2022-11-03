const mongoose = require('mongoose')
//mongoose.set('debug', true);

const MarketOrder = mongoose.Schema(
    {
        tradingsymbol: {type: String},     
        exchange: { type: String}, 
        instrument_type: { type: String},  
        price: { type: String},   
        order_status: { type: String}, 
        qty: { type: String}, 
        product: { type: String}, 
        trans: { type: String}, 
        bid: { type: mongoose.Schema.ObjectId, ref: 'bots' }
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('market_orders', MarketOrder)