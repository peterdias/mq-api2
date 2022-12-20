const mongoose = require('mongoose')
//mongoose.set('debug', true);

const Strategy = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please set title'],      
        },     
        description: {
            type: String,                 
        },    
        uid: { type: String }
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('strategies', Strategy)