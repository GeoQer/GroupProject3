const express = require('express');
const router = express.Router();
const db = require('../resources/db');

router.get('/all', (req, res) => {
    db.collection('stations').where('isArchived', '==', false).get()
        .then(docs => {
            const arr = [];
            docs.forEach(doc => arr.push({...doc.data(), id: doc.id}));
            res.json(arr);
        })
})

router.post('/create', (req, res) => {
    db.collection('stations').add({
        name: req.body.stationName,
        isArchived: false
    })
    .then(doc => res.json({...doc.data(), id: doc.id}))
    .catch(err => 
        res.json({ ...err }))
})

router.put('/remove', (req, res) => {
    console.log('ID: ', req.body.id)
    db.collection('stations').doc(req.body.id).update({
        isArchived: true
    })
    .then(() => res.json({success: true}))
    .catch(err => 
        res.json({...err}))
})
module.exports = router;