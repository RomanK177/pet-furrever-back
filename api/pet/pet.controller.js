const petService = require('./pet.service');
const logger = require('../../services/logger.service');

// PET CRUD //

async function getPets(req, res) {
    try {
        const pets = await petService.query(req.query);
        res.send(pets);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function getPet(req, res) {
    try {
        const pet = await petService.getById(req.params.id);
        res.send(pet);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function removePet(req, res) {
    try {
        await petService.remove(req.params.id);
        res.end();
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function createPet(req, res) {
    let pet = req.body;
    pet.ownerId = req.session.user._id
    try {
        await petService.add(pet);
        res.send(pet);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function updatePet(req, res) {
    const pet = req.body;
    try {
        await petService.update(pet);
        const realPet = await petService.getById(pet._id)
        res.send(realPet);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function addComment(req, res) {
    let comment = req.body;
    let petId = req.params.id;
    comment.by = {};
    console.log(petId)
    if (!req.session.user) {
        comment.by = { userId: null, fullName: "Guest", imgUrl: "guest.jpg" }
    } else {
        comment.by.userId = req.session.user._id;
        comment.by.fullName = req.session.user.fullName;
        comment.by.imgUrl = req.session.user.imgUrlProfile;
    }
    try {
        const pet = await petService.addComment(petId, comment);
        res.json(pet);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function addTreat(req, res) {
    let petId = req.params.id;
    try {
        const treats = await petService.addTreat(petId);
        res.json({ treats });
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

module.exports = {
    getPet,
    getPets,
    removePet,
    createPet,
    updatePet,
    addComment,
    addTreat
}