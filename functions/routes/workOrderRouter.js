const express = require('express');
const router = express.Router();
const db = require('../resources/db');

router.get('/all', (req, res) => {
    db.collection('work-orders').get()
        .then(docs => {
            let arr = [];
            docs.forEach(doc => arr.push(doc.data()));
            res.json({arr});
        })
        .catch(err => res.json({ err });
})


module.exports = router;