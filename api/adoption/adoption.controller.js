const adoptionService = require('./adoption.service');
const logger = require('../../services/logger.service');


async function getAdoptions(req, res) {
    const adoption = await adoptionService.query(req.query);
    res.send(adoption);
}

async function getAdoption(req, res) {
    const adoption = await adoptionService.getById(req.params.id);
    res.send(adoption);
}

async function removeAdoption(req, res) {
    await adoptionService.remove(req.params.id);
    res.end();
}

async function createAdoption(req, res) {
    let adoption = req.body;
    adoption.user._id = req.session.user._id
    adoption.user.name = req.session.user.name
    try {
        adoption = await adoptionService.add(adoption);
        res.send(adoption);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function updateAdoption(req, res) {
    const adoption = req.body;
    await adoptionService.update(adoption);
    res.send(adoption);
}

module.exports = {
    getAdoptions,
    getAdoption,
    removeAdoption,
    createAdoption,
    updateAdoption
}