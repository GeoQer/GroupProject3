const admin = require('firebase-admin');
const serviceAccount = require('../../firebaseapikey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'project-runner-f1bdc.appspot.com'
});

module.exports = admin;