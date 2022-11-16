const mongoose = require('mongoose')
//mongoose.set('debug', true);

const LogBot = mongoose.Schema(
    {
         
        botid: { type: mongoose.Schema.ObjectId, ref: 'bots' },         
        title: {type: String }, 
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('logs_bot', LogBot)