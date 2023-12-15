require("dotenv").config();
require('newrelic');
const express = require("express");
const compression = require('compression')
const path = require("path");
const bodyParser = require('body-parser')
const { getReviews, getMeta, putHelpful, putReported, postNew } = require('./db')

const app = express();

app.use(compression())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../client')));

app.get('/reviews/', (req, res) => {
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
    if (!product_id) {
      throw new Error('Invalid product id')
    }
    res.status(200).json(result)
  }).catch((err) => {
    res.status(404).send(
      err.message
    )
  })

})

app.get('/reviews/meta/', (req, res) => {
  const product_id = Number(req.query.product_id);
  getMeta(product_id).then((result) => {
    if (!product_id) {
      throw new Error('Invalid product id')
    }
    res.status(200).json(result)
  }).catch((err) => {
    res.status(404).send(
      err.message
    )
  })

})

app.get('/loaderio-bb786447e36be9e4fe7ece9d745c67ed.txt', (req, res) => {
  res.sendFile(path.join(__dirname, '../../loaderio-bb786447e36be9e4fe7ece9d745c67ed.txt'))
})

app.put('/reviews/:review_id/helpful', (req, res) => {
  const review_id = Number(req.params.review_id);
  putHelpful(review_id).then(() => {
    res.status(204).send()
  }).catch((err) => { console.log(err) });
})

app.put('/reviews/:review_id/report', (req, res) => {
  const review_id = Number(req.params.review_id);
  putReported(review_id).then(() => {
    res.status(204).send()
  }).catch((err) => { console.log('error is in server', err) });
})

app.post('/reviews', (req, res) => {
  postNew(req.body);
  res.status(201).send();
})

const dataTest = {
  product_id: 250,
  rating: 4,
  summary: 'Test Data Summary',
  body: 'Test of the Body text insert text here',
  recommend: true,
  name: 'clay',
  email: 'you@you.com',
  photos: ['wwww.test.com', 'www.test2.com'],
  characteristics: {
    'Fit': 4,
    'Length': 4,
    'Comfort': 4,
    'Quality': 4,

  }


}

console.log(JSON.stringify(dataTest))


app.listen(process.env.PORT);
console.log(`Listening at http://localhost:${process.env.PORT}`);
