const firebaseadmin = require('firebase-admin');

const serviceAccount = require('./firebaseserviceaccount.json');

firebaseadmin.initializeApp({
	credential: firebaseadmin.credential.cert(serviceAccount),
});

const getAllUsers = async () => {
	firebaseadmin.auth().listUsers(1000).then((listUsersResult) => { 
		let users = []
		listUsersResult.users.forEach(user => {        
		  users.push({
			'id': user.uid,
			'email': user.email,
			'displayName': user.displayName,
			'creationTime' : user.metadata.creationTime,
			'lastSignInTime': user.metadata.lastSignInTime,
			//'providerId' : user.providerData[0].UserInfo.providerId
		  })
		});      
		
		return users 
	})
	.catch(function (error) {
		return []
	});
  }

module.exports = {firebaseadmin, getAllUsers};