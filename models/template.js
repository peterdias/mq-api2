const mongoose = require('mongoose')

const templateSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    onchart: {
      type: String      
    },
    offchart: {
      type: String       
    },
    uid: { type: mongoose.Schema.ObjectId, ref: 'users' }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('templates', templateSchema)