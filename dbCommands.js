//ETL PROCESS

//Navigate to the folder run these commands ouside of mongoSH

/*
mongoimport --db tmp --collection tmp_characteristics_reviews --file sample_characteristic_reviews.csv --type csv --port 27017 --headerline

mongoimport --db tmp --collection tmp_characteristics --file sample_characteristics.csv --type csv --port 27017 --headerline

mongoimport --db tmp --collection tmp_reviews --file sample_reviews.csv --type csv --port 27017 --headerline

mongoimport --db tmp --collection tmp_photos --file sample_reviews_photos.csv --type csv --port 27017 --headerline
*/
/*
mongoimport --db sdc_reviews --collection tmp_characteristics_reviews --file characteristic_reviews.csv --type csv --port 27017 --headerline

mongoimport --db sdc_reviews --collection tmp_characteristics --file characteristics.csv --type csv --port 27017 --headerline

mongoimport --db sdc_reviews --collection tmp_reviews --file reviews.csv --type csv --port 27017 --headerline

mongoimport --db sdc_reviews --collection tmp_photos --file reviews_photos.csv --type csv --port 27017 --headerline
*/

//Inside of mongoSH

db.tmp_characteristics_reviews.createIndex({ characteristic_id: -1 })

// Joining characteristic ratings to thier characteristic
db.tmp_characteristics.aggregate([
  {
    $lookup:
    {
      from: "tmp_characteristics_reviews",
      localField: "id",
      foreignField: "characteristic_id",
      as: "ratings",
      pipeline: [
        {
          $unset: ["id", "characteristic_id"]
        }
      ]
    }
  },
  {
    $out: "merged_char",
  }
]).explain('executionStats')


db.tmp_characteristics_reviews.drop()
db.tmp_characteristics.drop()

db.merged_char.createIndex({ product_id: -1 })
// Joining merged_char with others from the same product
db.merged_char.aggregate([
  {
    $group:
    {
      _id: "$product_id",
      characteristics: {
        $push: {
          name: "$name",
          ratings: "$ratings"
        }
      }

    }
  },
  {
    $out: "characteristics",
  }
])


db.merged_char.drop()

db.tmp_reviews.createIndex({ id: -1 })
db.tmp_photos.createIndex({ review_id: -1 })
db.tmp_reviews.aggregate([
  {
    $lookup:
    {
      from: "tmp_photos",
      localField: "id",
      foreignField: "review_id",
      as: "photos",
      pipeline: [
        {
          $unset: ["id", "review_id"]
        }
      ]
    }
  },
  {
    $out: "reviews",
  }
])


db.tmp_photos.drop()
db.tmp_reviews.drop()

db.reviews.createIndex({ product_id: -1 })

