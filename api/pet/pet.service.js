const { text } = require('body-parser');
const { request } = require('http');
const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getById,
    remove,
    update,
    add,
    addComment,
    addLike
}

// TODO: SORT AND IN STOCK
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

    if (requestQuery.favorites) {
        // for getting user favorites
        // 1. Get all user favorite pets ids
        // { "_id": { $in: [favorite pet ids goes here]] } }
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
        aggQuery.push({ $match: queryFilter });
    }

    if (requestQuery._sort) {
        const sortField = requestQuery._sort.toLowerCase()
        const allowedSortFields = ['name', 'type', 'size'];
        if (allowedSortFields.includes(sortField)) {
            aggQuery.push({ $sort: { [sortField]: 1 } });
        }
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
    const collection = await dbService.getCollection('pets');
    try {
        await collection.insertOne(pet);
        return pet;
    } catch (err) {
        console.log(`ERROR: cannot insert pet`)
        throw err;
    }
}


async function addComment(petId, comment) {
    const collection = await dbService.getCollection('pets')
    if (comment.by.userId) comment.by.userId = ObjectId(comment.by.userId);
    // comment.aboutUserId = ObjectId(comment.aboutUserId);
    console.log(comment)
    try {
        const result = await collection.updateOne({ _id: ObjectId(petId) },
            { $push: { comments: comment } });
        const pet = await getById(petId);
        return pet;
    } catch (err) {
        console.log(`ERROR: cannot insert user`)
        throw err;
    }
}

async function addLike(petId) {
    const collection = await dbService.getCollection('pets')
    try {
        const result = await collection.updateOne({ _id: ObjectId(petId) },
            { $inc: { 'numOfTreats': 1 } });

        const pet = await getById(petId)
        return pet.numOfTreats;
    } catch (err) {
        console.log(`ERROR: cannot insert like`)
        throw err;
    }
}