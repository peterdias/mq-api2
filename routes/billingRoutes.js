const express = require('express')
const router = express.Router()

const { protect }  = require('../middleware/auth');

const {
    getOrder, 
    getOrders, 
    saveOrder, 
    getInvoice,
    getInvoices,
    saveInvoice ,
    getAllPayments 
  } = require('../controllers/billingController')

router.post('/getorder',protect,getOrder)
router.post('/saveorder',protect,saveOrder)
router.post('/getorders',protect,getOrders)
router.post('/getallorders',protect,getOrders)
router.post('/getinvoice',protect,getInvoice)
router.post('/saveinvoice',protect,saveInvoice)
router.post('/getinvoices',protect,getInvoices)
router.post('/getallinvoices',protect,getInvoices)
router.post('/getallpayments',protect,getAllPayments)
module.exports = router