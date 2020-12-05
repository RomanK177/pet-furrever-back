// const { text } = require('body-parser');
// const { request } = require('http');
const { request } = require('express');
const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getById,
    remove,
    update,
    add,
    addComment,
    addTreat,
    approveAdoption
}

async function query(requestQuery) {
    const mainFilter = _filterBy(requestQuery);
    let aggQuery = [{
        $lookup: {
            from: 'users',
            localField: 'ownerId',
            foreignField: '_id',
            as: 'owner'
        },
    }]

    if (mainFilter.length) {
        aggQuery.push({
            $match: {
                $and: mainFilter
            }
        });
    }

    if (requestQuery._sort) {
        const sortField = requestQuery._sort.toLowerCase()
        const allowedSortFields = ['name', 'type', 'size'];
        if (allowedSortFields.includes(sortField)) {
            aggQuery.push({ $sort: {
                    [sortField]: 1 } });
        }
    }

    try {
        const collection = await dbService.getCollection('pets')
        let pets = await collection.aggregate(aggQuery).toArray();
        pets.map((pet) => {
            if (pet.owner && pet.owner.length) {
                pet.owner = pet.owner[0];
            }
        })
        return pets;
    } catch (err) {
        console.log('ERROR: cannot find pets', err)
        throw err;
    }
}

function _filterBy(requestQuery) {
    console.log("🚀 ~ file: pet.service.js ~ line 64 ~ _filterBy ~ requestQuery", requestQuery)
    let mainFilter = []

    // TODO: Support lowercase
    // TODO: Support search by all
    if (requestQuery.txt) {
        let textFields = []
        textFields.push({ "name": { $regex: `.*${requestQuery.txt}.*` } });
        textFields.push({ "description": { $regex: `.*${requestQuery.txt}.*` } });
        textFields.push({ "about": { $regex: `.*${requestQuery.txt}.*` } });

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

    // TODO: Support if Roman want this filter
    // if (requestQuery.favorites) {
    //     for getting user favorites
    //     1. Get all user favorite pets ids
    //     { "_id": { $in: [favorite pet ids goes here]] } }
    // }
    return mainFilter;
}


async function getById(petId) {
    const collection = await dbService.getCollection('pets');
    try {
        let aggQuery = [{
                $match: { "_id": ObjectId(petId) }
            },
            {
                $lookup: {
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
        } else {
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
    // pet._id = ObjectId(pet._id);
    try {
        await collection.replaceOne({ _id: ObjectId(pet._id) }, pet);
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
        const result = await collection.updateOne({ _id: ObjectId(petId) }, { $push: { comments: comment } });
        const pet = await getById(petId);
        return pet;
    } catch (err) {
        console.log(`ERROR: cannot insert user`)
        throw err;
    }
}

async function addTreat(petId) {
    const collection = await dbService.getCollection('pets')
    try {
        const result = await collection.updateOne({ _id: ObjectId(petId) }, { $inc: { 'numOfTreats': 1 } });

        const pet = await getById(petId)
        return pet.numOfTreats;
    } catch (err) {
        console.log(`ERROR: cannot insert like`)
        throw err;
    }
}

async function approveAdoption(petId) {
    const collection = await dbService.getCollection('pets')
    try {
        const result = await collection.updateOne({ _id: ObjectId(petId) }, { $set: { adoptedAt: new Date() } });
        const pet = await getById(petId);
        return pet;
    } catch (err) {
        console.log(`ERROR: cannot insert adoption request`)
        throw err;
    }
}

async function declineAdoption(petId) {
    const collection = await dbService.getCollection('pets')
    try {
        const result = await collection.updateOne({ _id: ObjectId(petId) }, { $set: { adoptedAt: null } });
        const pet = await getById(petId);
        return pet;
    } catch (err) {
        console.log(`ERROR: cannot insert adoption request`)
        throw err;
    }
}