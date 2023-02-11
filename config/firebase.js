const firebaseadmin = require('firebase-admin');

const serviceAccount = require('./firebaseserviceaccount.json');

firebaseadmin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

module.exports = firebaseadmin;