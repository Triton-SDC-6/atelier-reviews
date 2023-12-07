require("dotenv").config();
const express = require("express");
const path = require("path");
const morgan = require('morgan')
const bodyParser = require('body-parser')

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

  const product_id = req.query.product_id;
  res.status(200).send(product_id)


  // fetch(search ? search : '').then((data) => {
  //   res.send(data);
  // })
})



app.listen(process.env.PORT);
console.log(`Listening at http://localhost:${process.env.PORT}`);