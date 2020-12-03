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
    try{
        const users = await userService.query(req.query)
        res.send(users)
    } catch(err){
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function removeUser(req, res) {
    try{
        await userService.remove(req.params.id)
        res.end()
    } catch(err){
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function updateUser(req, res) {
    const user = req.body;
    try{
        await userService.update(user)
        res.send(user)
    } catch(err){
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
    let review = req.body;
    let ownerId = req.params.id;
    review.by = {};
    if (!req.session.user) {
        review.by = { userId: null, fullName: "Guest", imgUrl: "guest.jpg" }
    } else {
        review.by.userId = req.session.user._id;
        review.by.fullName = req.session.user.fullName;
        review.by.imgUrl = req.session.user.imgUrlProfile;
    }
    try {
        review = await userService.addReview(ownerId, review);
        // comment.byUser = req.session.user;
        // TODO - need to find aboutUser?
        // review.aboutUser = {}
        res.send(review);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function addToFavorite(req, res) {
    let favoritePetId = req.params.id;
    //TODO: Do we want to support guess favorites??
    if (!req.session.user) {
        review.by = { userId: null, fullName: "Guest", imgUrl: "guest.jpg" }
    } else {
        review.by.userId = req.session.user._id;
        review.by.fullName = req.session.user.fullName;
        review.by.imgUrl = req.session.user.imgUrlProfile;
    }
    try {
        review = await userService.addToFavorite(favoritePetId);
        // comment.byUser = req.session.user;
        // TODO - need to find aboutUser?
        // review.aboutUser = {}
        res.send(review);
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
    addToFavorite
}