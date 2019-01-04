const admin = require('firebase-admin');
const serviceAccount = require('../../project-runner-f1bdc-firebase-adminsdk-ypp57-ec3e8188eb.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'project-runner-f1bdc.appspot.com'
});

module.exports = admin;