const db = require('../resources/db');
const express = require('express');
const router = express.Router();

router.post('/create', (req, res) => {
    const part = req.body.part;
    if (part.id) {
        db.collection(`parts`).doc(part.id).get()
            .then(doc => {
                if (doc.exists) {
                    db.collection('parts').doc(part.id).set({
                        name: part.name || '',
                        stations: part.stations,
                        filename: part.filename,
                    }, {merge: true})
                        .then(response => res.json({ existingPartID: part.id }))
                }
            })
    }
    else {
        db.collection('parts').add({
            id: part.id || '',
            name: part.name || '',
            stations: part.stations,
            filename: part.filename,
            isArchived: false
        })
            .then(response => {
                res.json({ newPartID: response.id })
            })
            .catch(err => 
                alert(`Error occurred, please refer to error code ${err}`),
                res.json({ err }))

    }
})

router.get('/edit/:id', (req, res) => {
    let path = `parts/${req.params.id}`;
    db.doc(path).get()
        .then(doc => {
            if (!doc.exists) {
                res.json({ exists: false });
            }

            res.json({ ...doc.data(), id: doc.data().id ? doc.data().id : doc.id });
        })
        .catch(err => {
            console.log(err);
            alert(`Error occurred, please refer to error code ${err}`);
            res.json({ err });
        })
})

router.get('/all', (req, res) => {
    db.collection('parts').where('isArchived', '==', false).get()
        .then(docs => {
            const arr = [];
            docs.forEach(doc => {
                    arr.push({ ...doc.data(), id: doc.id, filepath: `${doc.id}/${doc.data().filename}` });
            });
            res.json(arr);
        })
})

router.put('/archive/:id', (req, res) => {
    db.collection('parts').doc(req.params.id).update({
        isArchived: true
    })
    .then(() => res.json({success: true}))
    .catch(err => 
        alert(`Error occurred, please refer to error code ${err}`),
        res.json({ err }))
})

module.exports = router;