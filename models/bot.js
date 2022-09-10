const mongoose = require('mongoose')
//mongoose.set('debug', true);

const Bot = mongoose.Schema(
    {       
        sid: { type: mongoose.Schema.ObjectId, ref: 'strategies' },           
        title: {type: String },     
        status: {type: String }, 
        uid: { type: mongoose.Schema.ObjectId, ref: 'users' },  
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('bots', Bot)