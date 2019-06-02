require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const client = require('./db')

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { username, userId } = jwt.verify(token, process.env.APP_SECRET)
    if (!username || !userId) {
      res.clearCookie('token')
      console.log('No user found - token cleared')
    }
    
    req.user = { username, userId }
  }
  next()
})

app.post('/signin', async (req, res, next) => {
  const { username, password } = req.body
  if (!username || !password) {
    throw new Error('Username and password required')
  }
  const userQuery = {
    text: 'SELECT * FROM app_user WHERE username = $1;',
    values: [username]
  }
  const [ user ] = await client.query(userQuery).then(res => res.rows)
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    throw new Error('Username or password invalid')
  }
  console.log(validPassword)

  // const userToken = jwt.sign(user, process.env.APP_SECRET)
  // res.cookie('token', userToken, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365})
  res.json({test: 'hello'})
})


const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
})

const cleanup = () => {
  console.log('\nShutting down server...');
  client.end();
  console.log('DB connection closed')
  server.close(() => console.log('Server closed'))
}

process.on('SIGTERM', cleanup)
process.on('SIGINT', cleanup)