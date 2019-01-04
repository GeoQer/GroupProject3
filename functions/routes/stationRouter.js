const express = require('express');
const router = express.Router();
const db = require('../resources/db');

router.get('/all', (req, res) => {
    db.collection('stations').get()
        .then(docs => {
            const arr = [];
            docs.forEach(doc => arr.push({...doc.data(), id: doc.id}));
            res.json(arr);
        })
})

module.exports = router;