const asyncHandler = require('express-async-handler')
const dotenv = require('dotenv').config()
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Payment = require('../models/payment')
const Order = require('../models/order')
const Invoice = require('../models/invoice')
const Plan = require('../models/subscription_plan')

const razor = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_APT_SECRET,
  });

const checkout = asyncHandler(async (req, res) => {
    const { amount} = req.body
     
    const options = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
    };
    
    const order = await razor.orders.create(options);
    
    res.status(200).json({
    success: true,
    order,
    });
    
})

const paymentVerification  = asyncHandler(async (req, res) => {
  const { payment,uid,planid,amount,frequency } = req.body;  

  const body = payment.razorpay_order_id + "|" + payment.razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET).update(body.toString()).digest("hex");

  const isAuthentic = expectedSignature === payment.razorpay_signature;

  if (isAuthentic) {
    
    let plan  = Plan.findOne({"_id": mongoose.Types.ObjectId(planid)})
    let order = Order.findOne({'uid': uid, 'status':'ACTIVE'})
    if(order && plan)
    {
      order.status = 'INACTIVE'
      await order.save()
      if(order.amount == 0) //Free Plan
      {
          let neworder = await Order.create({
            uid,
            planid,
            frequency,
            amount,
            remarks: plan.title,
            startdate: Date.now(),
            'status': 'ACTIVE'
          })  

          if(neworder){
              let newinvoice = await Invoice.create({
                  oid: neworder._id,
                  amount: amount, 
                  frequency: frequency,
                  remarks: plan.title,
              })

              if(newinvoice)
              {
                await Payment.create({razorpay_order_id:payment.razorpay_order_id, 
                  razorpay_payment_id: payment.razorpay_payment_id,
                  razorpay_signature: payment.razorpay_signature,
                }); 
            
                res.status(200).json({success: true});
              }
          }
      }
    }    

  } else {
    res.status(400).json({success: false,});
  }
    
})
 
const getkey  = asyncHandler(async (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
})

module.exports = {
    checkout,
    paymentVerification,
    getkey
}