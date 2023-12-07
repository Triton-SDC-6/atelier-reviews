require("dotenv").config();
const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`);
console.log(process.env.DB_NAME)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'ERRRROOOORRRRR:'));
db.once('open', () => {
  console.log('connected to', process.env.DB_NAME);
})

const reviewSchema = new mongoose.Schema({

})

const findData = async () => {
  console.log('FUNC');
  const item = await reviews.findOne();
  console.log(item);
}

findData();
