// app.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('dotenv').config();
const connection = require('./connection');



app.get('/', (req, res) => {
    res.status(200).send({ message: "Hello World!" });
  });

module.exports = app;
