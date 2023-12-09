require("dotenv").config();
const { MongoClient, ObjectId } = require('mongodb');
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
  };

  const ratings = await db.collection('reviews').aggregate([
    { $match: { 'product_id': productId } },
    { $group: { _id: "$rating", count: { $sum: 1 } } }
  ]).toArray()

  let ratingsObj = {}
  ratings.forEach((rating) => {
    ratingsObj[rating._id] = rating.count.toString();
  })

  meta["ratings"] = ratingsObj;

  const recommends = await db.collection('reviews').aggregate([
    { $match: { 'product_id': productId } },
    { $group: { _id: "$recommend", count: { $sum: 1 } } }
  ]).toArray();

  let recomendsObj = {}
  recommends.forEach((obj) => {
    recomendsObj[obj._id] = obj.count.toString();
  })

  meta["recommended"] = recomendsObj;

  const characteristics = await db.collection('characteristics').aggregate([
    { $match: { '_id': productId } },
    { $unwind: '$characteristics' },
    { $unwind: '$characteristics.ratings' },
    {
      $group: {
        _id: { id: '$characteristics._id', name: '$characteristics.name' },
        value: { $avg: '$characteristics.ratings.value' }
      }
    }
  ]).toArray();

  let charObj = {};
  characteristics.forEach((char) => {
    charObj[char._id.name] = { value: char.value.toString() }
  })

  meta["characteristics"] = charObj;


  return meta
};

async function putHelpful(reviewId) {
  console.log('reviewId', reviewId)
  try {
    await db.collection('reviews').updateOne({ 'id': reviewId }, { $inc: { 'helpfulness': 1 } })
  } catch (err) {
    console.log(err, 'ErOrR')
  }
}
async function putReported(reviewId) {
  console.log('reviewId report', reviewId)
  try {
    await db.collection('reviews').updateOne({ 'id': reviewId }, { $set: { 'reported': true } })
  } catch (err) {
    return err
  }
}

async function postNew(body) {
  const characteristics = body.characteristics
  delete body.characteristics
  console.log(characteristics)
  await db.collection('reviews').insertOne(body)
  await Object.keys(characteristics).forEach((char) => {
    db.collection('characteristics').updateOne(
      { '_id': body.product_id, 'characteristics.name': char },
      { $push: { "characteristics.$.ratings": { _id: new ObjectId(), value: characteristics[char] } } }

    )
  })
}

module.exports = { getReviews, getMeta, putHelpful, putReported, postNew };

