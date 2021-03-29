'use strict';
const MongoClient = require('mongodb').MongoClient;
//TODO: Don't forget to set ElasticIp otherwise this address will keep changing
const url = 'mongodb://root:Mxj4bu7WMQCI@ec2-3-248-190-6.eu-west-1.compute.amazonaws.com';
const dbName = 'trashAppDB';
const collectionName = 'users';

let cachedDb = null;

module.exports.getStuff = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const stuffId = event.pathParameters.stuffId;
  let client = null;

  if (cachedDb) {
    client = cachedDb;
  }
  else {
    client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
      .catch(err => { console.log(err); });
    cachedDb = client;
  }

  if (!client) {
      return;
  }
  try {
      const db = client.db(dbName);
      let collection = db.collection(collectionName);
      let query = { name: 'Volkswagen' }
      let res = await collection.findOne(query);
      console.log(res);
      return {
        statusCode: 200,
        body: JSON.stringify("done!")
      };
  } catch (err) {
      console.log(err);
      return {
        statusCode: 200,
        body: JSON.stringify(err)
      };
  } finally {
      client.close();
  }
};
