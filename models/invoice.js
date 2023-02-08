const mongoose = require('mongoose')
//mongoose.set('debug', true);

const Invoice = mongoose.Schema(
    {
        oid: { type: mongoose.Schema.ObjectId, ref: 'billing_orders' },
        remarks: {type: String}, 
        amount: {type: Number }, 
        billing_name: { type: String },      
        billing_address1: { type: String },   
        billing_address2: { type: String }, 
        billing_pincode: { type: String },   
        billing_city: { type: String }, 
        billing_state: { type: String },  
        billing_country: { type: String }, 
        payment_mode: { type: String }, 
        uid: { type: String }, 
        status: { type: String}, 
    },
    { timestamps: true, }
)

module.exports = mongoose.model('billing_invoices', Invoice)