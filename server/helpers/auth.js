var admin = require('firebase-admin');

var serviceAccount = require('../config/fbServiceAccountKey.json');
const { assertWrappingType } = require('graphql');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


exports.authCheck = async (req) => {
  try {
    const currentUser = await admin.auth().verifyIdToken(req.headers.authtoken);
    console.log('CURRENT USER', currentUser);
    return currentUser;
  } catch (e) {
    console.log('AUTH CHECK ERROR', e);
    throw new Error('Invalid or expired token');
  }
};
