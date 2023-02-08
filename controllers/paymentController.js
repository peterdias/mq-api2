const asyncHandler = require('express-async-handler')
const dotenv = require('dotenv').config()
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Payment = require('../models/payment')

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
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    //res.redirect(`http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`);

    res.status(200).json({
        success: true,
        payment_id: razorpay_payment_id,
        });

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