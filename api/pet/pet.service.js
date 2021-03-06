// const { text } = require('body-parser');
// const { request } = require('http');
const { request } = require("express");
const dbService = require("../../services/db.service");
const userService = require("../user/user.service");
const ObjectId = require("mongodb").ObjectId;

module.exports = {
  query,
  getById,
  remove,
  update,
  add,
  addComment,
  addTreat,
  approveAdoption,
};

let aggQuery = [
  {
    $lookup: {
      from: "users",
      localField: "ownerId",
      foreignField: "_id",
      as: "owner",
    },
  },
];

async function query(requestQuery) {
  const mainFilter = _filterBy(requestQuery);
  let aggQuery = [
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner",
      },
    },
  ];

  if (mainFilter.length) {
    aggQuery.push({
      $match: {
        $and: mainFilter,
      },
    });
  }

  if (requestQuery._sort) {
    const sortField = requestQuery._sort.toLowerCase();
    const allowedSortFields = ["name", "type", "size"];
    if (allowedSortFields.includes(sortField)) {
      aggQuery.push({
        $sort: {
          [sortField]: 1,
        },
      });
    }
  }

  try {
    const collection = await dbService.getCollection("pets");
    let pets = await collection.aggregate(aggQuery).toArray();
    pets.map((pet) => {
      if (pet.owner && pet.owner.length) {
        pet.owner = pet.owner[0];
      }
    });
    return pets;
  } catch (err) {
    console.log("ERROR: cannot find pets", err);
    throw err;
  }
}

function _filterBy(requestQuery) {
  let mainFilter = [];
  // TODO: Support search by all
  if (requestQuery.txt) {
    let textFields = [];
    // textFields.push({ "name": { $regex: `.*${requestQuery.txt }.*` } });
    textFields.push({ name: { $regex: new RegExp(requestQuery.txt, "i") } });
    // textFields.push({ "description": { $regex: `.*${requestQuery.txt}.*` } });
    textFields.push({
      description: { $regex: new RegExp(requestQuery.txt, "i") },
    });
    // textFields.push({ "about": { $regex: `.*${requestQuery.txt}.*` } });
    // textFields.push({ "ownerName":   { $regex : new RegExp('^' + requestQuery.txt + ".*", "i", "m")}});
    textFields.push({
      ownerName: { $regex: new RegExp(requestQuery.txt, "gmi") },
    });

    mainFilter.push({
      $or: textFields,
    });
  }

  if (requestQuery.type) {
    mainFilter.push({ type: { $eq: requestQuery.type } });
  }

  if (requestQuery.size) {
    mainFilter.push({ size: { $eq: requestQuery.size } });
  }

  return mainFilter;
}

async function getById(petId) {
  const collection = await dbService.getCollection("pets");
  try {
    let aggQuery = [
      {
        $match: { _id: ObjectId(petId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "owner",
        },
      },
    ];
    let pet = await collection.aggregate(aggQuery).toArray();
    if (pet.length) {
      pet = pet[0];
    }

    if (pet.owner.length && pet.owner[0]) {
      pet.owner = pet.owner[0];
      delete pet.owner.password;
    } else {
      pet.owner = null;
    }
    return pet;
  } catch (err) {
    console.log(`ERROR: cannot find pet ${petId}`);
    throw err;
  }
}

async function remove(petId) {
  const collection = await dbService.getCollection("pets");
  try {
    await collection.deleteOne({ _id: ObjectId(petId) });
  } catch (err) {
    console.log(`ERROR: cannot remove pet ${petId}`);
    throw err;
  }
}

async function update(pet) {
  const collection = await dbService.getCollection("pets");
  const id = pet._id;
  delete pet._id;
  delete pet.owner;

  pet.ownerId = ObjectId(pet.ownerId);

  try {
    await collection.replaceOne({ _id: ObjectId(id) }, pet);
    pet._id = id;
    return pet;
  } catch (err) {
    console.log(`ERROR: cannot update pet ${pet._id}`);
    throw err;
  }
}

async function add(pet) {
  const collection = await dbService.getCollection("pets");
  try {
    await collection.insertOne(pet);
    return pet;
  } catch (err) {
    console.log(`ERROR: cannot insert pet`);
    throw err;
  }
}

async function addComment(petId, comment) {
  const collection = await dbService.getCollection("pets");
  if (comment.by.userId) comment.by.userId = ObjectId(comment.by.userId);
  // comment.aboutUserId = ObjectId(comment.aboutUserId);
  console.log(comment);
  try {
    const result = await collection.updateOne(
      { _id: ObjectId(petId) },
      { $push: { comments: comment } }
    );
    const pet = await getById(petId);
    return pet;
  } catch (err) {
    console.log(`ERROR: cannot insert user`);
    throw err;
  }
}

async function addTreat(petId) {
  const collection = await dbService.getCollection("pets");
  try {
    const result = await collection.updateOne(
      { _id: ObjectId(petId) },
      { $inc: { numOfTreats: 1 } }
    );

    const pet = await getById(petId);
    return pet.numOfTreats;
  } catch (err) {
    console.log(`ERROR: cannot insert like`);
    throw err;
  }
}

async function approveAdoption(petId) {
  const collection = await dbService.getCollection("pets");
  try {
    const result = await collection.updateOne(
      { _id: ObjectId(petId) },
      { $set: { adoptedAt: new Date() } }
    );
    const pet = await getById(petId);
    return pet;
  } catch (err) {
    console.log(`ERROR: cannot insert adoption request`);
    throw err;
  }
}

async function declineAdoption(petId) {
  const collection = await dbService.getCollection("pets");
  try {
    const result = await collection.updateOne(
      { _id: ObjectId(petId) },
      { $set: { adoptedAt: null } }
    );
    const pet = await getById(petId);
    return pet;
  } catch (err) {
    console.log(`ERROR: cannot insert adoption request`);
    throw err;
  }
}
