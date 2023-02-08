const mongoose = require('mongoose')
//mongoose.set('debug', true);

const Payment = mongoose.Schema(
    {
        invoiceid: { type: mongoose.Schema.ObjectId, ref: 'billing_invoices' },
        remarks: {type: String}, 
        amount: {type: Number }, 
        payment_mode: { type: String }, 
        uid: { type: String }, 
        status: { type: String}, 
    },
    { timestamps: true, }
)

module.exports = mongoose.model('billing_payments', Payment)