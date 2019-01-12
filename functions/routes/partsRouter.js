const db = require('../resources/db');
const express = require('express');
const router = express.Router();

router.post('/create', (req, res) => {
    const part = req.body.part;
    console.log('PART: ', req.body.part);

    db.collection('parts').add({
        id: part.id || '',
        name: part.name || '',
        stations: part.stations,
        filename: part.filename
    })
        .then(response => {
            res.json({ newPartID: response.id })
        })
        .catch(err => res.json({ err }))
})

router.get('/edit/:id', (req, res) => {
    let path = `parts/${req.params.id}`;
    db.doc(path).get()
        .then(doc => {
            if (!doc.exists) {
                res.json({ exists: false });
            }

            res.json({...doc.data(), id: doc.data().id ? doc.data().id : doc.id});
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