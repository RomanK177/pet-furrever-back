const adoptionService = require('./adoption.service');
const logger = require('../../services/logger.service');

// PET CRUD //

async function getAdoptions(req, res) {
    const adoption = await adoptionService.query(req.query);
    res.send(adoption);
}

async function getAdoption(req, res) {
    const doption = await adoptionService.getById(req.params.id);
    res.send(doption);
}
  
async function removeAdoption(req, res) {
    await adoptionService.remove(req.params.id);
    res.end();
}

async function createAdoption(req, res) {
    const doption = req.body;
    await adoptionService.save(doption);
    res.send(doption);
}

async function updateAdoption(req, res) {
    const doption = req.body;
    await adoptionService.save(doption);
    res.send(doption);
}

module.exports = {
    getAdoptions,
    getAdoption,
    removeAdoption,
    createAdoption,
    updateAdoption
}