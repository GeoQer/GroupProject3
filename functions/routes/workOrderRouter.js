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
    const partsCompleted = parseInt(req.body.partsCompleted);
    const partialQty = parseInt(req.body.partialQty);

    const newHistoryItem = {
        employeeName,
        employeeID,
        stationName: currentStation.name,
        time: currentStation.time,
        partsCompleted
    }

    db.collection('work-orders').doc(id).update({
        currentStation,
        history: firebase.firestore.FieldValue.arrayUnion(newHistoryItem),
        partialQty
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
    const isAssembly = req.body.isAssembly;

    if (!isAssembly) {
        db.collection('parts').doc(job.part.id).get()
            .then(doc => {
                db.collection('work-orders').add({
                    ...job,
                    part: { ...doc.data(), id: doc.id },
                    currentStation: doc.data().stations[0],
                    isComplete: false,
                    currentStationIndex: 0,
                    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
                    history: [],
                    partialQty: Number(0)
                })
                    .then(doc => res.json({ id: doc.id }))
                    .catch(err =>
                        res.json({ err }));
            });
    }
    else {
        const batch = db.batch();
        db.collection('assemblies').doc(job.part.id).get()
            .then(assembly => {
                const parts = assembly.data().parts;
                parts.forEach(part => {
                    let partRef = db.collection('work-orders').doc();
                    batch.set(partRef, {
                        isAssembly: true,
                        assemblyName: assembly.data().name,
                        assemblyID: assembly.id,
                        notes: job.notes,
                        currentStation: part.stations[0],
                        currentStationIndex: 0,
                        part: {...part},
                        quantity: job.quantity * part.quantity,
                        isComplete: false,
                        dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
                        history: []
                    })
                })
                batch.commit()
                    .then(() => res.json({ success: true }))
                    .catch(err => res.json({ err }))
            })
            .catch(err => res.json({ err }))
    }
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
            history: firebase.firestore.FieldValue.arrayUnion(newHistoryItem),
            partialQty: Number(0)
        })
    }

    res.json({ success: true });
})



module.exports = router;