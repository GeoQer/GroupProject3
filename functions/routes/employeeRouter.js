const express = require('express');
const router = express.Router();
const db = require('../resources/db');

router.get('/all', (req, res) => {
    db.collection('users').where('isArchived', '==', false).get()
        .then(docs => {
            let arr = [];
            docs.forEach(doc => arr.push({...doc.data(), id: doc.id}));
            res.json(arr);
        })
        .catch(err => res.json({ err }));
})

router.get('/:id', (req, res) => {
    db.collection('employees').doc(req.params.id).get()
        .then(doc => {
            doc = doc.data();
            console.log(doc);
            res.json({
                name: doc.name,
                isAdmin: doc.isAdmin || false,
                status: {
                    currentStation: doc.status.currentStation || "",
                    isActive: doc.status.isActive || false,
                    isLoggedIn: doc.status.isLoggedIn || false,
                }
            });
        })
        .catch(err => {console.log(err); res.json({ err })});
})

router.put('/togglepermission', (req, res) => {
    if (!req.body.id) {
        res.json({ err: 'Please provide a valid employee id' });
    }
    else if (req.body.isAdmin != "true" && req.body.isAdmin != "false") {
        res.json({ err: 'Please provide an "isAdmin" parameter with a boolean data type' })
    }
    else {
        db.collection('users').doc(req.body.id).get()
            .then(doc => {
                if(!doc.exists){
                    res.json({err: 'Employee not found'});
                    return;
                }

                db.collection('users').doc(req.body.id).set({ isAdmin: (req.body.isAdmin === 'true' ? false : true) }, { merge: true })
                .then(() => res.json({ success: true }))
                .catch(err => res.json({ err }));
            })
    }
})

router.put('/archive/:id', (req, res) => {
    db.collection('users').doc(req.params.id).update({
        isArchived: true
    })
    .then(() => res.json({success: true}))
    .catch(err => res.json({ err }))
})

router.delete('/delete/:id', (req, res) => {
    db.collection('users').doc(req.params.id).delete()
    .then(() => res.json({success: true}))
    .catch(err => res.json({ err }))
})
module.exports = router;