const admin = require('../config/firebase');
const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    try {         
        const decodeValue = await admin.auth().verifyIdToken(token);         
        if (decodeValue) {
            req.user = decodeValue;
            next();
        }
        //return res.json({ message: 'Un authorized' });
        res.status(401)
        throw new Error('Not authorized')

    } catch (e) {
        return res.json({ message: 'Internal Error' });
    }
})

module.exports = { protect }