require("dotenv").config();
const { MongoClient } = require('mongodb');
const uri = `mongodb://localhost:27017/${process.env.DB_NAME}`;
const client = new MongoClient(uri);
const db = client.db("sdc_reviews")

client.connect()

async function getReviews(product_id, limit, page, sorting) {

  try {
    reviews = await db.collection("reviews")
      .find({ "product_id": product_id })
      .skip(limit * (page - 1))
      .limit(limit).sort(sorting)
      .toArray();
    return reviews;
  } catch (error) {
    return error
  }
};
async function getMeta(productId) {
  let meta = {
    product_id: productId.toString(),
    "ratings": {
      "1": "155",
      "2": "219",
      "3": "341",
      "4": "364",
      "5": "763"
    },
    "recommended": {
      "false": "465",
      "true": "1377"
    },
    "characteristics": {
      "Fit": {
        "id": 135219,
        "value": "3.2370766488413547"
      },
      "Length": {
        "id": 135220,
        "value": "3.2798541476754786"
      },
      "Comfort": {
        "id": 135221,
        "value": "3.3731060606060606"
      },
      "Quality": {
        "id": 135222,
        "value": "3.3389355742296919"
      }
    }
  };
  return meta
};

module.exports = { getReviews, getMeta }



// async function main() {

//   try {
//     await client.connect();

//     await listDatabases(client);

//   } catch (e) {
//     console.error(e);
//   } finally {
//     await client.close();
//   }
// };

// main().catch(console.error);

