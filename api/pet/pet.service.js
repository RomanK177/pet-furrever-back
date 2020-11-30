const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;

const gToys = require('../../data/pets.json');

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}

async function query() {
    const collection = await dbService.getCollection('pets')
    try {
        const pets = await collection.find({}).toArray();
        return pets
    } catch (err) {
        console.log('ERROR: cannot find pets')
        throw err;
    }
}

async function getById(petId) {
    const collection = await dbService.getCollection('pets');
    try {
        const pet = await collection.findOne({ '_id': ObjectId(petId) });
        return pet;
    } catch (err) {
        console.log(`ERROR: cannot find pet ${petId}`)
        throw err;
    }
}

async function remove(petId) {
    const collection = await dbService.getCollection('pets');
    try {
        await collection.deleteOne({ '_id': ObjectId(petId) })
    } catch (err) {
        console.log(`ERROR: cannot remove pet ${petId}`)
        throw err;
    }
}

async function update(pet) {
    const collection = await dbService.getCollection('pets');
    pet._id = ObjectId(pet._id);
    try {
        await collection.replaceOne({ _id: pet._id }, pet);
        return pet;
    } catch (err) {
        console.log(`ERROR: cannot update pet ${pet._id}`)
        throw err;
    }
}

async function add(pet) {
    try {
        await collection.insertOne(pet);
        return pet;
    } catch (err) {
        console.log(`ERROR: cannot insert pet`)
        throw err;
    }
}