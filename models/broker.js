const mongoose = require('mongoose')
//mongoose.set('debug', true);

const Broker = mongoose.Schema(
    {
        broker_code: {type: String},    
        broker_title: {type: String},   
        description: { type: String}, 
        website_url: { type: String}, 
        active: {type: Boolean}
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('trading_brokers', Broker)