const firebaseadmin = require('firebase-admin');

const serviceAccount = require('./firebaseserviceaccount.json');

firebaseadmin.initializeApp({
	credential: firebaseadmin.credential.cert(serviceAccount),
});

module.exports = firebaseadmin;