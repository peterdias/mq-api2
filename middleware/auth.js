const admin = require('../config/firebase');
const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    try {         
        const decodeValue = await admin.auth().verifyIdToken(token);         
        if (decodeValue) {
            req.user = decodeValue;
            console.log(decodeValue)
            return next();
        }              

    } catch (e) {
        res.status(401)
        throw new Error('Not authorized')
    }
})

module.exports = { protect }