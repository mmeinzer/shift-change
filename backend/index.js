require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const db = require('./db')

const app = express()
app.use(bodyParser.json())

app.get('/', async (req, res, next) => {
  res.json({test: 'hello'})
})

const PORT = 3333
app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`))
