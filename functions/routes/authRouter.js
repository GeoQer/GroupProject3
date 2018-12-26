const express = require('express');
const router = express.Router();
const firebase = require('firebase');
var config = {
    apiKey: "AIzaSyAZB-qbjpKVRvaQt17kPsPTMav3O12by6k",
    authDomain: "project-runner-f1bdc.firebaseapp.com",
    databaseURL: "https://project-runner-f1bdc.firebaseio.com",
    projectId: "project-runner-f1bdc",
    storageBucket: "project-runner-f1bdc.appspot.com",
    messagingSenderId: "757776283780"
  };
  firebase.initializeApp(config);
const auth = firebase.auth();

router.post('/create', (req, res) => {
    auth.createUserWithEmailAndPassword(req.body.email, req.body.password)
        .then(user => res.json(user))
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
})

router.post('/logout', (req, res) => {
    auth.signOut()
    .then(() => res.json({ signedOut: true}))
    .catch(err => {
        console.log(err);
        res.json({ err });
    })
})

module.exports = router;