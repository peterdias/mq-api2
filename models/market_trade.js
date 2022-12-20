const mongoose = require('mongoose')
//mongoose.set('debug', true);

const MarketTrade = mongoose.Schema(
    {
        tradingsymbol: {type: String},     
        exchange: { type: String}, 
        instrument_type: { type: String},  
        price: { type: Number},  
        qty: { type: Number},  
        trans: { type: String}, 
        source: { type: String},
        bid: { type: mongoose.Schema.ObjectId, ref: 'bots' },
        uid: { type: String }
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('market_trades', MarketTrade)