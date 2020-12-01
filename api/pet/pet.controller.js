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
    let pet = req.body;
    console.log('Creating pet', pet, req.session)
    pet.ownerId = req.session.user._id
    await petService.add(pet);
    res.send(pet);
}

async function updatePet(req, res) {
    const pet = req.body;
    await petService.update(pet);
    res.send(pet);
}

async function addComment(req, res) {
    let comment = req.body;
    let petId = req.params.id;
    console.log(petId)
    comment.by = req.session.user;
    if (!comment.by) {
        comment.by = '{ userId: "null", fullName: "Guest", imgUrl: "guest.jpg" }'
    } else {
        comment.by.userId = req.session.user.userId;
        comment.by.fullName = req.session.user.fullName;
        comment.by.imgUrl = req.session.user.imgUrlProfile;
    }
    try {
        comment = await petService.addComment(petId, comment);
        // comment.byUser = req.session.user;
        // TODO - need to find aboutUser?
        // review.aboutUser = {}
        res.send(comment);
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
    addComment
}