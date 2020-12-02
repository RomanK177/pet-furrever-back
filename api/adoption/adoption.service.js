const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getById,
    remove,
    update,
    add
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

async function update(adoption) {
    const collection = await dbService.getCollection('adoptions');
    adoption._id = ObjectId(adoption._id);
    try {
        await collection.replaceOne({ _id: adoption._id }, adoption);
        return adoption;
    } catch (err) {
        console.log(`ERROR: cannot update adoption ${adoption._id}`)
        throw err;
    }
}

async function add(adoption) {
    const collection = await dbService.getCollection('adoptions');
    try {
        await collection.insertOne(adoption);
        return adoption;
    } catch (err) {
        console.log(`ERROR: cannot insert adoption`)
        throw err;
    }
}