const mongoose = require('mongoose')
//mongoose.set('debug', true);

const Payment = mongoose.Schema(
    {
      invoiceid: { type: mongoose.Schema.ObjectId, ref: 'billing_invoices' },
        razorpay_order_id: {
            type: String,
            required: true,
          },
          razorpay_payment_id: {
            type: String,
            required: true,
          },
          razorpay_signature: {
            type: String,
            required: true,
          },
    },
    { timestamps: true, }
)

module.exports = mongoose.model('billing_payments', Payment)