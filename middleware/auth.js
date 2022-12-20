const admin = require('../config/firebase');
const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        console.log(token)
        const decodeValue = await admin.auth().verifyIdToken(token);
        console.log(decodeValue)
        if (decodeValue) {
            req.user = decodeValue;
            return next();
        }
        return res.json({ message: 'Un authorized' });
    } catch (e) {
        return res.json({ message: 'Internal Error' });
    }
})

module.exports = { protect }