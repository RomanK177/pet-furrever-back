const adoptionService = require('./aadoption.service');
const logger = require('../../services/logger.service');


async function getAadoptions(req, res) {
    const aadoption = await adoptionService.query(req.query);
    res.send(aadoption);
}

async function getAadoption(req, res) {
    const adoption = await adoptionService.getById(req.params.id);
    res.send(adoption);
}

async function removeAadoption(req, res) {
    await aaadoptionService.remove(req.params.id);
    res.end();
}

async function createAadoption(req, res) {
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

async function updateAadoption(req, res) {
    const adoption = req.body;
    await adoptionService.update(adoption);
    res.send(adoption);
}

module.exports = {
    getAadoptions,
    getAadoption,
    removeAadoption,
    createAadoption,
    updateAadoption
}