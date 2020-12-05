const dbService = require('../../services/db.service');
const petService = require('../pet/pet.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getById,
    remove,
    add,
    updateRequest,
    sendMessage
}

async function query() {
    const collection = await dbService.getCollection('adoptions')
    try {
        const adoptions = await collection.find({}).toArray();
        return adoptions
    } catch (err) {
        console.log('ERROR: cannot find adoptions')
        throw err;
    }
}

async function getById(adoptionId) {
    const collection = await dbService.getCollection('adoptions');
    try {
        const adoption = await collection.findOne({ '_id': ObjectId(adoptionId) });
        return adoption;
    } catch (err) {
        console.log(`ERROR: cannot find adoption ${adoptionId}`)
        throw err;
    }
}

async function remove(adoptionId) {
    const collection = await dbService.getCollection('adoptions');
    try {
        await collection.deleteOne({ '_id': ObjectId(adoptionId) })
    } catch (err) {
        console.log(`ERROR: cannot remove adoption ${adoptionId}`)
        throw err;
    }
}

async function add(adoptionRequest) {
    const collection = await dbService.getCollection('adoptions');
    adoptionRequest.pet._id = ObjectId(adoptionRequest.pet._id);
    adoptionRequest.user._id = ObjectId(adoptionRequest.user._id);
    try {
        const result = await collection.insertOne(adoptionRequest);
        return result.insertedId.toString();
    } catch (err) {
        console.log(`ERROR: cannot insert adoption`)
        throw err;
    }
}

async function updateRequest(adoptionRequest) {
    const collection = await dbService.getCollection('adoptions');

    try {
        if (adoptionRequest.status === 'approved') {
            petService.approveAdoption(adoptionRequest.pet._id)
            await collection.updateOne({ _id: ObjectId(adoptionRequest._id) },
                { $set: { status: 'approved' } });
            return adoptionRequest;
        } else if (adoptionRequest.status === 'declined') {
            await collection.updateOne({ _id: ObjectId(adoptionRequest._id) },
                { $set: { status: 'declined' } });
            return adoptionRequest;
        } else if (adoptionRequest.status === 'cancelled') {
            await collection.updateOne({ _id: ObjectId(adoptionRequest._id) },
                { $set: { status: 'cancelled' } });
            return adoptionRequest;
        }
    } catch (err) {
        console.log(`ERROR: cannot update adoption ${adoptionRequest._id}`)
        throw err;
    }
}

async function sendMessage(message, adoptionRequestId, userId) {
    const collection = await dbService.getCollection('adoptions');
    try {
        await collection.updateOne({ _id: ObjectId(adoptionRequestId) },
            { $push: { messages: message } });
        const adoptionRequest = await getById(adoptionRequestId)
        if (userId === adoptionRequest.adopter._id) {
            await collection.updateOne({ _id: ObjectId(adoptionRequestId) },
                { $set: { 'messages.owner': false } });
        } else if (userId === adoptionRequest.owner._id) {
            await collection.updateOne({ _id: ObjectId(adoptionRequestId) },
                { $set: { 'messages.adopter': false } });
        }
        return adoptionRequest.messages;
    } catch (err) {
        console.log(`ERROR: cannot send message ${message}`)
        throw err;
    }
}