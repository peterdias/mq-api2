const mongoose = require('mongoose')
//mongoose.set('debug', true);

const Bot = mongoose.Schema(
    {
        sid: { type: mongoose.Schema.ObjectId, ref: 'strategies' },
        entry_code: {type: String },     
        entry_xml: {type: String }, 
        exit_code: {type: String }, 
        exit_xml: {type: String },  
        uid: { type: mongoose.Schema.ObjectId, ref: 'users' }
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('bots', Bot)