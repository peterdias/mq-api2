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
    uid: { type: String }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('templates', templateSchema)