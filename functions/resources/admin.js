const admin = require('firebase-admin');
const serviceAccount = require('../../project-runner-f1bdc-firebase-adminsdk-ypp57-0e9ff6bb26.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'project-runner-f1bdc.appspot.com'
});

module.exports = admin;