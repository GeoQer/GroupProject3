const express = require('express');
const router = express.Router();
const db = require('../resources/db');
const firebase = require('firebase/app');
require('firebase/firestore');

function combineWorkorders() {
    let hit = false;
    let deleteID = null;
    let updateID = null;
    const updatedWorkOrder = {};
    const workOrders = [];


    db.collection('work-orders').get()
        .then(docs => {
            docs.forEach(doc => workOrders.push({ ...doc.data(), id: doc.id }));
            for (let i = 0; i < workOrders.length; i++) {
                for (let j = 0; j < workOrders.length; j++) {
                    if (i !== j && !hit) {
                        if (workOrders[i].part.id === workOrders[j].part.id && workOrders[i].currentStationIndex === workOrders[j].currentStationIndex) {
                            if (workOrders[i].parentWorkOrder === workOrders[j].parentWorkOrder) {
                                hit = true;
                                deleteID = workOrders[j].id;
                                updateID = workOrders[i].id;
                                workOrders[i].quantity += workOrders[j].quantity;
                                workOrders[i].history = [...workOrders[i].history, ...workOrders[j].history];
                                workOrders[i].partialQty += workOrders[j].partialQty;
                                Object.assign(updatedWorkOrder, workOrders[i]);
                            }

                            if (workOrders[j].parentWorkOrder === workOrders[i].id) {
                                hit = true;
                                deleteID = workOrders[j].id;
                                updateID = workOrders[i].id;
                                workOrders[i].quantity += workOrders[j].quantity;
                                workOrders[i].history = [...workOrders[i].history, ...workOrders[j].history];
                                workOrders[i].partialQty += workOrders[j].partialQty;
                                Object.assign(updatedWorkOrder, workOrders[i]);
                            }

                            if (workOrders[i].parentWorkOrder === workOrders[j].id) {
                                hit = true;
                                deleteID = workOrders[i].id;
                                updateID = workOrders[j].id;
                                workOrders[j].quantity += workOrders[i].quantity;
                                workOrders[j].history = [...workOrders[i].history, ...workOrders[j].history];
                                workOrders[j].partialQty += workOrders[i].partialQty;
                                Object.assign(updatedWorkOrder, workOrders[j]);
                            }
                        }
                    }
                }
                db.collection('work-orders').doc(deleteID).delete();
                db.collection('work-orders').doc(updateID).update({
                    ...updatedWorkOrder
                })
            }
        })
        .catch(err => err);

}


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
        partsCompleted,
        timeStamp: new Date()
    }

    db.collection('work-orders').doc(id).update({
        currentStation,
        history: firebase.firestore.FieldValue.arrayUnion(newHistoryItem),
        partialQty
    })
        .then(() => {
            combineWorkorders();
            res.json({ success: true })
        })
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
                        part: { ...part },
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
    const partsCompleted = req.body.partsCompleted;

    const newHistoryItem = {
        employeeName,
        employeeID,
        stationName: currentWorkOrder.currentStation.name,
        time: currentWorkOrder.currentStation.time,
        timeStamp: new Date(),
        partsCompleted
    }

    currentWorkOrder.part.stations[currentWorkOrder.currentStationIndex] = currentWorkOrder.currentStation;

    if (currentWorkOrder.currentStationIndex === currentWorkOrder.part.stations.length - 1) {
        db.collection('work-orders').doc(currentWorkOrder.id).update({
            ...currentWorkOrder,
            isComplete: true,
            dateCompleted: firebase.firestore.FieldValue.serverTimestamp(),
            history: firebase.firestore.FieldValue.arrayUnion(newHistoryItem)
        })
            .then(() => combineWorkorders())
    }
    else {
        db.collection('work-orders').doc(currentWorkOrder.id).update({
            ...currentWorkOrder,
            currentStationIndex: currentWorkOrder.currentStationIndex + 1,
            currentStation: currentWorkOrder.part.stations[currentWorkOrder.currentStationIndex + 1],
            history: firebase.firestore.FieldValue.arrayUnion(newHistoryItem),
            partialQty: Number(0)
        })
            .then(() => combineWorkorders())
    }

    res.json({ success: true });
})

router.post('/split', (req, res) => {
    const staticWorkOrder = req.body.staticWorkOrder;
    const newWorkOrder = {};
    Object.assign(newWorkOrder, staticWorkOrder);

    const currentStation = req.body.currentStation;
    const employeeID = req.body.employeeID;
    const employeeName = req.body.username;
    const partsCompleted = req.body.partsCompleted;

    const newHistoryItem = {
        employeeName,
        employeeID,
        stationName: currentStation.name,
        time: currentStation.time,
        partsCompleted,
        timeStamp: new Date()
    }

    newWorkOrder.currentStationIndex += 1;
    newWorkOrder.currentStation = newWorkOrder.part.stations[newWorkOrder.currentStationIndex];
    newWorkOrder.history = [];
    newWorkOrder.history.push(newHistoryItem);
    newWorkOrder.quantity = Number((parseInt(newWorkOrder.partialQty) + parseInt(partsCompleted)));
    newWorkOrder.partialQty = 0;


    db.collection('work-orders').doc(staticWorkOrder.id).update({
        quantity: (staticWorkOrder.quantity - (staticWorkOrder.partialQty + partsCompleted)),
        partialQty: Number(0)
    })
        .then(() => {
            db.collection('work-orders').add({
                ...newWorkOrder,
                parentWorkOrder: staticWorkOrder.id
            })
                .then(() => {
                    combineWorkorders();
                    res.json({ success: true })
                })
                .catch(err => res.json({ err }))
        })
        .catch(err => res.json({ err }))
})



module.exports = router;