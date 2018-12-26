const db = require('../resources/admin').firestore();
db.settings({timestampsInSnapshots: true});

module.exports = db;