const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware');

const {
    getList,
    saveList,
    getItems ,
    addItem,
    removeItem
  } = require('../controllers/watchlistController')

app.use(authMiddleware.decodeToken);

router.post('/list',getList)
router.post('/items',getItems)
router.post('/savelist',saveList)
router.post('/addItem',addItem)
router.post('/removeItem',removeItem)

module.exports = router