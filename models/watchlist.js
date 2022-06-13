const mongoose = require('mongoose')
//mongoose.set('debug', true);

const WatchList = mongoose.Schema(
    {
        symid: {
            type: Number      
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
        uid: { type: mongoose.Schema.ObjectId, ref: 'user' }
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('watchlist', WatchList)