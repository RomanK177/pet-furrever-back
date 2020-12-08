const adoptionService = require('./adoption.service');
const logger = require('../../services/logger.service');
const petService = require('../pet/pet.service');
const { request } = require('express');
const { getById } = require('../pet/pet.service');
const socket = require('../../server')

async function getAdoptionRequests(req, res) {
    try {
        const adoption = await adoptionService.query(req.query);
        res.send(adoption);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}
async function getAdoptionRequest(req, res) {
    try {
        const adoption = await adoptionService.getById(req.params.id);
        res.send(adoption);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}
async function removeAdoptionRequest(req, res) {
    try {
        await adoptionService.remove(req.params.id);
        res.end();
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}
async function createAdoptionRequest(req, res) {

    let petId = req.body.petId;
    let pet = await petService.getById(petId)
    let adoptionRequest = {
        pet: {
            _id: petId,
            name: pet.name
        },
        adopter: {
            _id: req.session.user._id,
            name: req.session.user.fullName,
        },
        owner: {
            _id: pet.owner._id,
            name: pet.owner.fullName,
        },
        status: "pending",
        createdAt: Date.now()
    }
    try {
        const adoptionId = await adoptionService.add(adoptionRequest);
        adoptionRequest._id = adoptionId;
        res.send(adoptionRequest);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}
async function updateAdoptionRequest(req, res) {

    const adoption = req.body;
    try {
        await adoptionService.updateRequest(adoption);
        res.send(adoption);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}
async function sendMessage(req, res) {
    const requestId = req.params.id;
    const message = {
        txt: req.body.message,
        from: req.session.user.fullName,
        date: new Date(),
    };
    try {
        const adoptionRequest = await adoptionService.sendMessage(message, requestId);
        socket.socketConnection.to(requestId).emit('new message')
        res.send(adoptionRequest);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}
<<<<<<< HEAD
=======


>>>>>>> 653c74a783d8ee52ac568f281a645b8935cc407c
module.exports = {
    getAdoptionRequests,
    getAdoptionRequest,
    removeAdoptionRequest,
    createAdoptionRequest,
    updateAdoptionRequest,
    sendMessage
}