const petService = require('./pet.service');
const logger = require('../../services/logger.service');

// PET CRUD //

async function getPets(req, res) {
    // `pets?_sort=${sortStr}${filterStr}`
    const pets = await petService.query(req.query);
    res.send(pets);
}

async function getPet(req, res) {
    const pet = await petService.getById(req.params.id);
    res.send(pet);
}
  
async function removePet(req, res) {
    await petService.remove(req.params.id);
    res.end();
}

async function createPet(req, res) {
    const pet = req.body;
    await petService.add(pet);
    res.send(pet);
}

async function updatePet(req, res) {
    const pet = req.body;
    await petService.update(pet);
    res.send(pet);
}

module.exports = {
    getPet,
    getPets,
    removePet,
    createPet,
    updatePet
}