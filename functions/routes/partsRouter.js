const db = require('../resources/db');
const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('../resources/admin');
const bucket = admin.storage().bucket();
router.post('/createpart', (req, res) => {
    let part = JSON.parse(req.body.part)

    db.collection('parts').add({
        name: part.name,
        processes: part.processes,
        //description: part.description,
        docs: []
    })
        .then(response => {
            let newPartPath = response.path;
            part.docs.forEach(newDoc => {
                bucket.upload(newDoc.file, { destination: `${part.name}/` }, (err, file, response) => {
                    if (err) {
                        res.json({ err })
                        return;
                    }
                    db.doc(newPartPath).update({
                        docs: firebase.firestore.FieldValue.arrayUnion({id:  response.id})
                    })
                })
            })
            res.json({success: true})
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

module.exports = router;