const { Client } = require('pg')
const client = new Client()

// requires environment variables to connect:
// PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT
client.connect()

module.exports = client