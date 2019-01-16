const admin = require('firebase-admin');
if (process.env.NODE_ENV !== 'production') {
    const serviceAccount = {
        type: process.env.type,
        project_id: process.env.project_id,
        private_key_id: process.env.private_key_id,
        private_key: process.env.private_key.replace(/\\n/g, '\n'),
        client_email: process.env.client_email,
        client_id: process.env.client_id,
        auth_uri: process.env.auth_uri,
        token_url: process.env.token_url,
        auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
        client_x509_cert_url: process.env.client_x509_cert_url
    }


    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'project-runner-f1bdc.appspot.com'
    });

}
else {
    admin.initializeApp();
}

module.exports = admin;