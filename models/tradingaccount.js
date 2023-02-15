const mongoose = require('mongoose')
//mongoose.set('debug', true);

const TradingAccount = mongoose.Schema(
    {               
      brokerid:  { type: mongoose.Schema.ObjectId, ref: 'trading_brokers' },
      accountid: {type: String}, 
      api_key: {type: String}, 
      api_secret: {type: String}, 
      token: {type: String}, 
      userid: {type: String}, 
      password: {type: String}, 
      twofa: {type: String}, 
      virtual: {type: Boolean},
      virtual_balance: {type: Number},
      start_date: {type: Date},
      active: { type: Boolean}, 
      uid: { type: String }, 
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('trading_accounts', TradingAccount)