"use strict";
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_ADDRESS = process.env.MONGO_ADDRESS;
const MongoClient = require("mongodb").MongoClient;
//TODO: Don't forget to set ElasticIp otherwise this address will keep changing
const url =
  "mongodb://" + MONGO_USERNAME + ":" + MONGO_PASSWORD + "@" + MONGO_ADDRESS;
const dbName = "trashAppDB";
const collectionName = "posts";

let cachedDb = null;

module.exports.getPosts = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let client = null;

  if (cachedDb) {
    client = cachedDb;
  } else {
    client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).catch((err) => {
      console.log(err);
    });
    cachedDb = client;
  }

  if (!client) {
    return;
  }
  try {
    const db = client.db(dbName);
    let collection = db.collection(collectionName);
    //let query = { name: 'Volkswagen' }
    let res = await collection.find({}).toArray();
    console.log(res);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(res),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(err),
    };
  }
};
