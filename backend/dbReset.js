// run this with `node dbReset.js` - not for importing as a module
// .env file with DB connect details required
// creates a default manager and default employee
require('dotenv').config()
const { Client } = require('pg')
const client = new Client()

client.connect()
execScript(client, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('DB reset. No errors.')
  }
  return client.end()
})

function execScript(client, cb) {
  const HARD_RESET_DB = `
    DROP TABLE IF EXISTS shift;
    DROP TABLE IF EXISTS app_user;
    CREATE TABLE app_user (
      id        SERIAL PRIMARY KEY,
      username  VARCHAR(128) NOT NULL,
      password  VARCHAR NOT NULL,
      manager   BOOLEAN DEFAULT FALSE
    );  
    CREATE TABLE shift (
      id            SERIAL PRIMARY KEY,
      app_user_id   int NOT NULL,
      start_time         TIMESTAMP NOT NULL,
      end_time           TIMESTAMP NOT NULL,
      FOREIGN KEY (app_user_id) REFERENCES app_user(id) ON DELETE CASCADE
    );
  `
  const sql = HARD_RESET_DB
  var statements = sql.split(/;\s*$/m);

  (function next() {
    var statement = statements.shift();
    if (statement) {
      client.query(statement, function(err, res) {
        if (err) return cb(err);
        console.log(res.command);
        next();
      });
    }
    else
      cb(null);
  })();
}

