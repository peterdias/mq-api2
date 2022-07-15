const mongoose = require('mongoose')
//mongoose.set('debug', true);

const WatchListItem = mongoose.Schema(
    {
        exchange: {
            type: String ,
            required: [true, 'Please set exchange'],      
        },
        tradingsymbol: {
            type: String,
            required: [true, 'Please set tradingsymbol'], 
        },
        last: {
            type: Number      
        },
        change: {
            type: Number      
        },
        changep: {
            type: Number      
        },
        lid: { type: mongoose.Schema.ObjectId, ref: 'watchlists' }
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('watchlistitems', WatchListItem)