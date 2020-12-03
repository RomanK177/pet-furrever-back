const adoptionService = require('./adoption.service');
const logger = require('../../services/logger.service');
const petService = require('../pet/pet.service');


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
    debugger
    let petId = req.body.petId;
    let pet = await petService.getById(petId)
    let adoptionRequest = {
        pet: {
            _id: petId,
            name: pet.name
        },
        user: {
            _id: req.session.user._id,
            name: req.session.user.name
        },
        owner: {
            _id: pet.owner.id,
            name: pet.owner.fullName,
        },
        status: "pending"
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
        await adoptionService.update(adoption);
        res.send(adoption);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

module.exports = {
    getAdoptionRequests,
    getAdoptionRequest,
    removeAdoptionRequest,
    createAdoptionRequest,
    updateAdoptionRequest
}