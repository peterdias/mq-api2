const mongoose = require('mongoose')
//mongoose.set('debug', true);

const Bot = mongoose.Schema(
    {       
        sid: { type: mongoose.Schema.ObjectId, ref: 'strategies' },           
        title: {type: String },    
        execution_type: {type: String }, 
        execution_frequency: {type: String}, 
        trading_account: { type: mongoose.Schema.ObjectId, ref: 'trading_accounts' },   
        stoploss: {type: Number }, 
        takeprofit: {type: Number }, 
        sltp_type: {type: String }, 
        status: {type: Number }, 
        uid: { type: String }
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('bots', Bot)