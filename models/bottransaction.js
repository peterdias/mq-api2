const mongoose = require('mongoose')
//mongoose.set('debug', true);

const BotTransaction = mongoose.Schema(
    {
        botid: { type: mongoose.Schema.ObjectId, ref: 'bots' },
        block: {type: String },    
        trans: {type: String },     
        entry_xml: {type: String }, 
        exit_code: {type: String }, 
        exit_xml: {type: String },  
        trans: {type: String },  
        symbol: {type: String },  
        strike: {type: Number },  
        type: {type: String },  
        qty: {type: Number }, 
        exchange: {type: String },                 
        product: {type: String },  
        expiry: {type: String },  
        tradingsymbol: {type: String },  
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('bottransactions', BotTransaction)