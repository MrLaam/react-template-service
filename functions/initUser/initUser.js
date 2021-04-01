"use strict";
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_ADDRESS = process.env.MONGO_ADDRESS;
const MongoClient = require("mongodb").MongoClient;
//TODO: Don't forget to set ElasticIp otherwise this address will keep changing
const url =
  "mongodb://" + MONGO_USERNAME + ":" + MONGO_PASSWORD + "@" + MONGO_ADDRESS;
const dbName = "trashAppDB";
const collectionName = "users";

let cachedDb = null;

module.exports.initUser = async (event, context) => {
  const userAttributes = event.request.userAttributes;
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
    if (
      event.triggerSource === "PostConfirmation_AdminConfirmSignUp" ||
      event.triggerSource === "PostConfirmation_ConfirmSignUp"
    ) {
      const db = client.db(dbName);
      let collection = db.collection(collectionName);
      let res = await collection.insertOne({ userId: userAttributes.sub, profilePictureUrl: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg" });
      console.log(res);
    }
    return event;
  } catch (err) {
    console.log(err);
    return event;
  }
};
