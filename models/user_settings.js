const mongoose = require('mongoose')

const UserSettings = mongoose.Schema(
  {
    address1: {
      type: String      
    },
    address2: {
        type: String      
      },
    mobile: {
        type: String      
      },
    city: {
        type: String      
      },
    state: {
        type: String      
      },
    country: {
        type: String      
      },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('UserSettings', UserSettings)