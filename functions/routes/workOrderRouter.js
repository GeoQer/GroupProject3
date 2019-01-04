const express = require('express');
const router = express.Router();
const db = require('../resources/db');

router.get('/all', (req, res) => {
    db.collection('work-orders').get()
        .then(docs => {
            let arr = [];
            docs.forEach(doc => arr.push({...doc.data(), id: doc.id}));
            res.json(arr);
        })
        .catch(err => res.json({ err }));
})

router.get('/active', (req, res) => {
    db.collection('work-orders').where('isComplete', '==', false).get()
        .then(docs => {
            const arr = [];
            docs.forEach(doc => arr.push({...doc.data(), id: doc.id}));
            res.json(arr);
        })
        .catch(err => res.json({ err }))
})

router.get('/active/:station', (req, res) => {
    db.collection('work-orders').where('isComplete', '==', false).where('station', '==', req.params.station).get()
    .then(docs => {
        const arr = [];
        docs.forEach(doc => arr.push({...doc.data(), id: doc.id}));
        res.json(arr);
    })
})

router.get('/complete', (req, res) => {
    db.collection('work-orders').where('isComplete', '==', true).get()
        .then(docs => {
            const arr = [];
            docs.forEach(doc => arr.push({...doc.data(), id: doc.id}));
            res.json(arr);
        })
        .catch(err => res.json({ err }))
})

router.put('/update', (req, res) => {
    const Props = JSON.parse(req.body.props);
    db.collection('work-orders').doc(req.body.id).set({...newProps}, {merge: true})
        .then(() => res.json({success: true}))
        .catch(err => res.json({ err }));
});

router.delete('/:id', (req, res) => {
    db.collection('work-orders').doc(req.params.id).delete()
        .then(() => res.json({success: true}))
        .catch(err => res.json({ err }));
})

router.post('/create', (req, res) => {
    const props = JSON.parse(req.body.props);
    db.collection('work-orders').add({...props})
        .then(doc => res.json({id: doc.id}))
        .catch(err => res.json({ err }));
})



module.exports = router;