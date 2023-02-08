const express = require('express')
const router = express.Router()

const { protect }  = require('../middleware/auth');

const {
    getOrder, 
    getOrders, 
    saveOrder, 
    getInvoice,
    getInvoices,
    saveInvoice  
  } = require('../controllers/billingController')

router.post('/getorder',protect,getOrder)
router.post('/saveorder',protect,saveOrder)
router.post('/getorders',protect,getOrders)
router.post('/getinvoice',protect,getInvoice)
router.post('/saveinvoice',protect,saveInvoice)
router.post('/getinvoices',protect,getInvoices)

module.exports = router