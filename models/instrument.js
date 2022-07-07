const mongoose = require('mongoose')

const instrumentSchema = mongoose.Schema(
  {
    exchange: {
      type: String     
    },
    segment: {
      type: String       
    },
    instrument_type: {
      type: String      
    },
    instrument_token: {
        type: Number      
    },
    trading_symbol: {
        type: String      
    },
    name: {
        type: String      
    },
    expiry: {
        type: String      
    },
    strike: {
        type: Number      
    },
    tick_size: {
        type: Number      
    },
     
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('symbols', instrumentSchema)