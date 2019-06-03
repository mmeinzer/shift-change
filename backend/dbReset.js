// run this with `node dbReset.js` - not for importing as a module
// .env file with DB connect details required
// creates a default manager and default employee
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const client = new Client();

client.connect();

async function execScript(dbClient, cb) {
  const ADMIN_PASS_HASH = await bcrypt.hash('mikemanager', 10);
  const USER_PASS_HASH = await bcrypt.hash('ericemployee', 10);
  const HARD_RESET_DB = `
    DROP TABLE IF EXISTS shift;
    DROP TABLE IF EXISTS app_user;
    CREATE TABLE app_user (
      id          SERIAL PRIMARY KEY,
      username    VARCHAR(128) NOT NULL,
      password    VARCHAR NOT NULL,
      manager     BOOLEAN DEFAULT FALSE,
      first_name  VARCHAR,
      last_name   VARCHAR,
      UNIQUE(username)
    );  
    CREATE TABLE shift (
      id            SERIAL PRIMARY KEY,
      app_user_id   int NOT NULL,
      start_time    TIMESTAMPTZ NOT NULL,
      end_time      TIMESTAMPTZ NOT NULL,
      FOREIGN KEY (app_user_id) REFERENCES app_user(id) ON DELETE CASCADE
    );

    INSERT INTO app_user(username, password, manager, first_name, last_name)
    VALUES('mikemanager', '${ADMIN_PASS_HASH}', true, 'Mike', 'Smith');

    INSERT INTO app_user(username, password, manager, first_name, last_name)
    VALUES('ericemployee', '${USER_PASS_HASH}', false, 'Eric', 'Mitchell');
    
    INSERT INTO shift(app_user_id, start_time, end_time)
    VALUES(1, '2019-06-08 13:00:00Z', '2019-06-08 17:00:00Z');
    
    INSERT INTO shift(app_user_id, start_time, end_time)
    VALUES(1, '2019-06-07 13:00:00Z', '2019-06-07 17:00:00Z');

    INSERT INTO shift(app_user_id, start_time, end_time)
    VALUES(2, '2019-06-05 13:00:00Z', '2019-06-05 17:00:00Z');

    INSERT INTO shift(app_user_id, start_time, end_time)
    VALUES(2, '2019-06-06 08:00:00Z', '2019-06-06 16:00:00Z');
  `;
  const sql = HARD_RESET_DB;
  const statements = sql.split(/;\s*$/m);

  (function next() {
    const statement = statements.shift();
    if (statement) {
      dbClient.query(statement, function(err, res) {
        if (err) return cb(err);
        console.log(res.command);
        next();
      });
    } else cb(null);
  })();
}

execScript(client, err => {
  if (err) {
    console.log(err);
  } else {
    console.log('DB reset. No errors.');
  }
  return client.end();
});
