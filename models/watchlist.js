const mongoose = require('mongoose')
//mongoose.set('debug', true);

const WatchList = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please set name'],      
        },        
        uid: { type: mongoose.Schema.ObjectId, ref: 'users' }
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('watchlists', WatchList)