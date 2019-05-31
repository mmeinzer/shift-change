require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const db = require('./db')

const app = express()
app.use(bodyParser.json())

app.get('/', async (req, res, next) => {
  const query = 'INSERT INTO app_user(username, password, manager) VALUES($1, $2, $3) RETURNING *'
  const values = ['admin', await bcrypt.hash('admin', 10), true]
  const qres = await db.query(query, values)
  console.log(qres.rows)
  console.log(await bcrypt.compare('admin', qres.rows[0].password))
  res.json({test: 'hello'})
})

const PORT = 3333
app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`))
