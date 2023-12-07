require("dotenv").config();
const { MongoClient } = require('mongodb');

async function listDatabases(client) {
  databasesList = await client.db("sdc_reviews").collection("reviews").find({ "product_id": 6302 }).count();

  console.log("RETURNED", databasesList);

};

async function main() {
  const uri = `mongodb://localhost:27017/${process.env.DB_NAME}`;
  const client = new MongoClient(uri);
  try {
    await client.connect();

    await listDatabases(client);

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

main().catch(console.error);





// const mongoose = require('mongoose');
// mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`);
// console.log(process.env.DB_NAME)
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'ERRRROOOORRRRR:'));
// db.once('open', () => {
//   console.log('connected to', process.env.DB_NAME);
// })

// const reviewSchema = new mongoose.Schema({

// })

// const findData = async () => {
//   console.log('FUNC');
//   const item = await reviews.findOne();
//   console.log(item);
// }

// findData();
