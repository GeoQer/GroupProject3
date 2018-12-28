const express = require('express');
const router = express.Router();
const firebase = require('../resources/firebase');
const auth = firebase.auth();
const db = require('../resources/db');

router.post('/create', (req, res) => {
    auth.createUserWithEmailAndPassword(req.body.email, req.body.password)
        .then(user => {
            db.collection('employees').add({
                name: req.body.name,
                isAdmin: false,
                status: {
                    currentStation: '',
                    isActive: false,
                    isLoggedIn: false
                }
            })
            .then(doc => res.json({msg: `User ${req.body.name} added with id: ${doc.id}`}))
            .catch(err => {console.log(err); json.res({err})})
        })
        .catch(err => {
            console.log(err);
            res.json({ err });
        });
});

router.post('/login', (req, res) => {
    auth.signInWithEmailAndPassword(req.body.email, req.body.password)
        .then(user => res.json(user))
        .catch(err => {
            console.log(err);
            res.json({ err });
        })
});

router.post('/logout', (req, res) => {
    auth.signOut()
    .then(() => res.json({ signedOut: true}))
    .catch(err => {
        console.log(err);
        res.json({ err });
    })
});

module.exports = router;