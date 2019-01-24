const express = require('express');
const router = express.Router();
const db = require('../resources/db');


router.post('/create', (req, res) => {
    db.collection('assemblies').add({ ...req.body.assembly, isArchived: false })
    .then(doc => {
        res.json({ success: true })
    })
    .catch(err => res.json({ err }))
});

router.get('/all', (req, res) => {
    db.collection('assemblies').where('isArchived', '==', false).get()
        .then(docs => {
            const arr = [];
            docs.forEach(doc => arr.push({...doc.data(), id: doc.id}));
            res.json(arr);
        })
        .catch(err => res.json({ err }))
})

router.put('/archive', (req, res) => {
    db.collection('assemblies').doc(req.body.id).update({
        isArchived: true
    })
    .then(() => res.json({success: true}))
    .catch(err => res.json({ err }))
})

module.exports = router;