const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

app.get('/', async (req, res, next) => {
  await console.log('test')
  res.json({test: 'hello'})
})

const PORT = 3333
app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`))
