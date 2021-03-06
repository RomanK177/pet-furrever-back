const userService = require('./user.service')
const logger = require('../../services/logger.service')

async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function getUsers(req, res) {
    try {
        const users = await userService.query(req.query)
        res.send(users)
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function removeUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.end()
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function updateUser(req, res) {
    const user = req.body;
    try {
        await userService.update(user)
        res.send(user)
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function createUser(req, res) {
    const user = req.body;
    await userService.add(user)
    res.send(user)
}

async function addReview(req, res) {
    let ownerId = req.params.id;
    let review = req.body;
    review.by = {};
    if (!req.session.user) {
        review.by = { userId: null, fullName: "Guest", imgUrl: null }
    } else {
        review.by.userId = req.session.user._id;
        review.by.fullName = req.session.user.fullName;
        review.by.imgUrl = req.session.user.imgUrlProfile;
    }
    try {
        const reviews = await userService.addReview(ownerId, review);
        res.send(reviews);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function updateFavorites(req, res) {
    let isFavorite = req.body.isFavorite;
    let userId = req.session.user._id;
    let favoritePetId = req.params.id;
    try {
        const user = await userService.updateFavorites(userId, favoritePetId, isFavorite);
        res.send(user);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

module.exports = {
    getUser,
    getUsers,
    removeUser,
    updateUser,
    createUser,
    addReview,
    updateFavorites
}