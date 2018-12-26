const db = require('../resources/db');
const express = require('express');
const router = express.Router();

router.post('/newpart', (req, res) => {
    let path = req.body.path;
    let part = req.body.part;
    part = JSON.parse(part);
    db.doc(path).set(part)
        .then(result => {
            console.log(result);
            res.json({success: true});
        })
        .catch(err => {
            console.log(err);
            res.json({ err });
        })

})

router.get('/part/:id', (req, res) => {
    
})

module.exports = router;
