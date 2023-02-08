const express = require('express')
const router = express.Router()

const { protect }  = require('../middleware/auth');

const {
    getPlan, 
    getPlans, 
    savePlan  
  } = require('../controllers/subscriptionController')

router.post('/get',protect,getPlan)
router.post('/save',protect,savePlan)
router.post('/all',getPlans)

module.exports = router