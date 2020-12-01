const { text } = require('body-parser');
const { request } = require('http');
const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}

async function query(requestQuery) {
    let mainFilter = []
    let queryFilter = null

    if (requestQuery.q) {
        textFields = []
        textFields.push({ "name": { $regex: `.*${requestQuery.q}.*` } });
        textFields.push({ "description": { $regex: `.*${requestQuery.q}.*` } });
        textFields.push({ "about": { $regex: `.*${requestQuery.q}.*` } });

        mainFilter.push({
            $or: textFields
        });
    }

    if (requestQuery.type) {
        mainFilter.push({ "type": { $eq: requestQuery.type } });
    }

    if (requestQuery.size) {
        mainFilter.push({ "size": { $eq: requestQuery.size } });
    }

    if (mainFilter.length) {
        queryFilter = {
            $and: mainFilter
        }
    }

    let aggQuery = [
        {
            $lookup:
            {
                from: 'users',
                localField: 'ownerId',
                foreignField: '_id',
                as: 'owner'
            },
            
        }
    ]

    if (queryFilter) {
        aggQuery['$match'] = queryFilter;
    }

    try {
        const collection = await dbService.getCollection('pets')
        let pets = await collection.aggregate(aggQuery).toArray();
        pets.map((pet) => {            
            if (pet.ownerId) {
                delete pet.ownerId;
            }

            if (pet.owner.length && pet.owner[0]) {
                pet.owner = pet.owner[0];
                delete pet.owner.password;
            }
            else {
                pet.owner = null
            }
            return pet;
        });
        return pets
    } catch (err) {
        console.log('ERROR: cannot find pets')
        throw err;
    }
}

async function getById(petId) {
    const collection = await dbService.getCollection('pets');
    try {
        let aggQuery = [
            {
                $match: { "_id": ObjectId(petId) }
            },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'ownerId',
                    foreignField: '_id',
                    as: 'owner'
                }
            }
        ]
        let pet = await collection.aggregate(aggQuery).toArray();
        if (pet.length) {
            pet = pet[0]
        }
        if (pet.ownerId) {
            delete pet.ownerId;
        }

        if (pet.owner.length && pet.owner[0]) {
            pet.owner = pet.owner[0];
            delete pet.owner.password;
        }
        else {
            pet.owner = null
        }
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
    pet.ownerId = ObjectId(pet.ownerId);
    const collection = await dbService.getCollection('pets');
    try {
        await collection.insertOne(pet);
        return pet;
    } catch (err) {
        console.log(`ERROR: cannot insert pet`)
        throw err;
    }
}