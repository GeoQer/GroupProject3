const db = require('../resources/db');
const express = require('express');
const router = express.Router();

router.post('/test', (req, res) => {
    console.log(req.body.doc);
    res.json({success: true});
})

router.post('/create', (req, res) => {
    const part = req.body.part;

    db.collection('parts').add({
        id: part.id || '',
        stations: part.stations,
        filename: part.filename
    })
        .then(response => {
            res.json({ newPartID: response.id })
        })
        .catch(err => res.json({ err }))
})

router.get('/part/:id', (req, res) => {
    let path = `test/${req.params.id}`;
    db.doc(path).get()
        .then(doc => {
            if (!doc.exists) {
                res.json({ exists: false });
            }

            res.json(doc.data());
        })
        .catch(err => {
            console.log(err);
            res.json({ err });
        })
})

router.get('/all', (req, res) => {
    db.collection('parts').get()
        .then(docs => {
            const arr = [];
            docs.forEach(doc => {
                if(doc.data().id !== '')
                    arr.push({...doc.data(), filepath: `${doc.id}/${doc.data().filename}`});
                else
                    arr.push({...doc.data(), id: doc.id, filepath: `${doc.id}/${doc.data().filename}`});
            });
            res.json(arr);
        })
})

module.exports = router;