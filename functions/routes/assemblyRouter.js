const express = require('express');
const router = express.Router();
const db = require('../resources/db');


router.post('/create', (req, res) => {
    db.collection('assemblies').add({ ...req.body.assembly })
    .then(doc => {
        res.json({ success: true })
    })
    .catch(err => res.json({ err }))
});

router.get('/all', (req, res) => {
    db.collection('assemblies').get()
        .then(docs => {
            const arr = [];
            docs.forEach(doc => arr.push({...doc.data(), id: doc.id}));
            res.json(arr);
        })
        .catch(err => res.json({ err }))
})

module.exports = router;