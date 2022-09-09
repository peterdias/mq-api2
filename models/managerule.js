const mongoose = require('mongoose')
//mongoose.set('debug', true);

const ManageRule = mongoose.Schema(
    {
        sqid: { type: mongoose.Schema.ObjectId, ref: 'sequences' },
        code: {type: String },     
        xml: {type: String },           
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model('managerules', ManageRule)