const express = require('express');
const router = express.Router();
const db = require('../resources/db');
const firebase = require('firebase/app');
require('firebase/firestore');

router.get('/all', (req, res) => {
    db.collection('work-orders').get()
        .then(docs => {
            let arr = [];
            docs.forEach(doc => arr.push({ ...doc.data(), id: doc.id }));
            res.json(arr);
        })
        .catch(err => 
            res.json({ err }));
})

router.get('/active', (req, res) => {
    db.collection('work-orders').where('isComplete', '==', false).get()
        .then(docs => {
            const arr = [];
            docs.forEach(doc => arr.push({ ...doc.data(), id: doc.id }));
            res.json(arr);
        })
        .catch(err => res.json({ err }))
})

router.get('/active/:station', (req, res) => {
    db.collection('work-orders').where('isComplete', '==', false).where('currentStation.id', '==', req.params.station).get()
        .then(docs => {
            const arr = [];
            docs.forEach(doc => arr.push({ ...doc.data(), id: doc.id }));
            res.json(arr);
        })
})

router.get('/complete', (req, res) => {
    db.collection('work-orders').where('isComplete', '==', true).get()
        .then(docs => {
            const arr = [];
            docs.forEach(doc => arr.push({ ...doc.data(), id: doc.id }));
            res.json(arr);
        })
        .catch(err => 
            res.json({ err }))
})

router.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const currentStation = req.body.currentStation;
    const employeeID = req.body.uid;
    const employeeName = req.body.username;

    const newHistoryItem = {
        employeeName,
        employeeID,
        stationName: currentStation.name,
        time: currentStation.time
    }

    db.collection('work-orders').doc(id).update({
        currentStation,
        history: firebase.firestore.FieldValue.arrayUnion(newHistoryItem)
    })
        .then(() => res.json({ success: true }))
        .catch(err => 
            res.json({ ...err }))
});

router.delete('/:id', (req, res) => {
    db.collection('work-orders').doc(req.params.id).delete()
        .then(() => res.json({ success: true }))
        .catch(err => 
            res.json({ err }));
})

router.post('/create', (req, res) => {
    const job = req.body.job
    db.collection('parts').doc(req.body.job.part.id).get()
        .then(doc => {
            db.collection('work-orders').add({ ...job, part: { ...doc.data(), id: doc.id }, currentStation: doc.data().stations[0], isComplete: false, currentStationIndex: 0, dateCreated: firebase.firestore.FieldValue.serverTimestamp(), history: [] })
                .then(doc => res.json({ id: doc.id }))
                .catch(err => 
                    res.json({ err }));
        });
})

router.put('/next', (req, res) => {
    const currentWorkOrder = req.body.currentWorkOrder;
    const employeeID = req.body.uid;
    const employeeName = req.body.username;

    const newHistoryItem = {
        employeeName,
        employeeID,
        stationName: currentWorkOrder.currentStation.name,
        time: currentWorkOrder.currentStation.time
    }

    currentWorkOrder.part.stations[currentWorkOrder.currentStationIndex] = currentWorkOrder.currentStation;

    if (currentWorkOrder.currentStationIndex === currentWorkOrder.part.stations.length - 1) {
        db.collection('work-orders').doc(currentWorkOrder.id).update({
            ...currentWorkOrder,
            isComplete: true,
            dateCompleted: firebase.firestore.FieldValue.serverTimestamp(),
            history: firebase.firestore.FieldValue.arrayUnion(newHistoryItem)
        })
    }
    else {
        db.collection('work-orders').doc(currentWorkOrder.id).update({
            ...currentWorkOrder,
            currentStationIndex: currentWorkOrder.currentStationIndex + 1,
            currentStation: currentWorkOrder.part.stations[currentWorkOrder.currentStationIndex + 1],
            history: firebase.firestore.FieldValue.arrayUnion(newHistoryItem)
        })
    }

    res.json({ success: true });
})



module.exports = router;