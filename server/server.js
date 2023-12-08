require("dotenv").config();
const express = require("express");
const path = require("path");
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { getReviews, getMeta } = require('./db')

const app = express();

app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, '../client')));

// app.post('/glossary', (req, res) => {
//   if (req.body && req.body.term) {
//     save(req.body.term, req.body.definition).then(() => {
//       res.send('posted')
//     })
//   }
// })


app.get('/reviews/', (req, res) => {
  // console.log(req)
  const page = Number(req.query.page) || 1
  const count = Number(req.query.count) || 5
  const product_id = Number(req.query.product_id);
  let sort = req.query.sort || 'newest'

  if (sort === 'helpful' || sort === 'relevant') {
    sort = { 'helpfulness': -1, 'date': -1 }
  }
  else {
    sort = { 'date': -1 }
  }

  getReviews(product_id, count, page, sort,).then((result) => {
    res.status(200).json(result)
  }).catch((err) => { console.log(err) })

})

app.get('/reviews/meta/', (req, res) => {
  const product_id = Number(req.query.product_id);

  getMeta(product_id).then((result) => {
    res.status(200).json(result)
  }).catch((err) => { console.log(err) })

})



app.listen(process.env.PORT);
console.log(`Listening at http://localhost:${process.env.PORT}`);