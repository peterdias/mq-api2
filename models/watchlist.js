const mongoose = require('mongoose')
//mongoose.set('debug', true);

const WatchList = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please set name'],      
        },        
        uid: { type: String }
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('watchlists', WatchList)