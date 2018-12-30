const db = require('../resources/firebase').firestore();
db.settings({timestampsInSnapshots: true});

module.exports = db;