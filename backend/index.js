require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const client = require('./db');

function handlePromiseRejection(middleware) {
  return (req, res, next) => middleware(req, res, next).catch(err => next(err));
}

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:8000' }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  handlePromiseRejection(async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
      let username;
      try {
        ({ username } = jwt.verify(token, process.env.APP_SECRET));
      } catch (err) {
        res.clearCookie('token');
        console.log('Invalid secret or expired token - cookie cleared');
        return next();
      }
      if (!username) {
        res.clearCookie('token');
        console.log('No username on token - cookie cleared');
        return next();
      }
      const userQuery = {
        text: 'SELECT * FROM app_user WHERE username = $1;',
        values: [username],
      };
      const [user] = await client.query(userQuery).then(data => data.rows);
      if (!user) {
        res.clearCookie('token');
        console.log(`User ${username} no longer exists`);
        return next();
      }
      req.user = user;
    }
    next();
  })
);

app.post(
  '/signin',
  handlePromiseRejection(async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new Error('Username and password required');
    }
    const userQuery = {
      text: 'SELECT * FROM app_user WHERE username = $1;',
      values: [username],
    };
    const [user] = await client.query(userQuery).then(data => data.rows);
    if (!user) {
      throw new Error('Username or password invalid (username)');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Username or password invalid (password)');
    }
    const clientUser = {
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      isManager: user.manager,
    };
    const userToken = jwt.sign(clientUser, process.env.APP_SECRET);
    const YEAR = 1000 * 60 * 60 * 24 * 365;
    res.cookie('token', userToken, {
      httpOnly: true,
      maxAge: YEAR,
    });
    res.json({ res: { user: clientUser } });
  })
);

app.post('/signout', (req, res, next) => {
  res.clearCookie('token');
  res.json({ res: 'Logged out' });
});

app.post(
  '/shift',
  handlePromiseRejection(async (req, res, next) => {
    const { user, body } = req;
    if (!user) throw new Error('You must be logged in to do that');
    if (!user.manager) throw new Error('Only managers can create shifts');
    const {
      employee,
      startTime: startTimeString,
      endTime: endTimeString,
    } = body;
    if (!employee || !startTimeString || !endTimeString)
      throw new Error(
        'Employee username, shift start-time, and shift end-time are required to create a shift'
      );
    let startTime;
    let endTime;
    try {
      startTime = new Date(startTimeString);
      endTime = new Date(endTimeString);
    } catch (err) {
      throw new Error("Couldn't parse start or end-time strings");
    }
    if (
      startTime.toString() === 'Invalid Date' ||
      endTime.toString() === 'Invalid Date'
    )
      throw new Error("Couldn't parse start or end-time strings");
    if (startTime > endTime)
      throw new Error('Start-time must be before end-time');
    const userQuery = {
      text: 'SELECT * FROM app_user WHERE username = $1;',
      values: [employee],
    };
    const [employeeUser] = await client
      .query(userQuery)
      .then(data => data.rows);
    if (!employeeUser) throw new Error(`No employee ${employee} found`);
    const shiftsQuery = {
      text: `
        SELECT shift.start_time, shift.end_time, app_user.username, app_user.first_name, app_user.last_name
        FROM shift
        LEFT JOIN app_user
        ON shift.app_user_id = app_user.id
        WHERE app_user.username = $1
        ORDER BY shift.start_time ASC;
      `,
      values: [employee],
    };
    const shifts = await client.query(shiftsQuery).then(data => data.rows);
    const overlapsExistingShift = shifts.some(
      ({ start_time: existingStart, end_time: existingEnd }) => {
        if (startTime > existingStart && startTime < existingEnd) return true;
        if (endTime > existingStart && endTime < existingEnd) return true;
        return false;
      }
    );
    if (overlapsExistingShift)
      throw new Error('A shift cannot overlap with any existing shift');
    const shiftInsertQuery = {
      text: `
        INSERT INTO shift(app_user_id, start_time, end_time)
        VALUES($1, $2, $3)
        RETURNING *;
      `,
      values: [employeeUser.id, startTime, endTime],
    };
    const { start_time: newStart, end_time: newEnd } = await client
      .query(shiftInsertQuery)
      .then(data => data.rows[0]);
    res.json({ res: { startTime: newStart, endTime: newEnd } });
  })
);

app.get(
  '/shifts',
  handlePromiseRejection(async (req, res, next) => {
    const { user } = req;
    if (!user) throw new Error('You must be logged in to do that');
    const shiftsQuery = {
      text: `
        SELECT shift.start_time, shift.end_time, app_user.username, app_user.first_name, app_user.last_name
        FROM shift
        LEFT JOIN app_user
        ON shift.app_user_id = app_user.id
        ORDER BY shift.start_time ASC;
      `,
    };
    const shifts = await client.query(shiftsQuery).then(data =>
      data.rows.map(row => ({
        username: row.username,
        startTime: row.start_time,
        endTime: row.end_time,
        firstName: row.first_name,
        lastName: row.last_name,
      }))
    );
    res.json({ res: { shifts } });
  })
);

app.get(
  '/shifts/:employeeUsername',
  handlePromiseRejection(async (req, res, next) => {
    const { user } = req;
    if (!user) throw new Error('You must be logged in to do that');
    const { employeeUsername } = req.params;
    const userQuery = {
      text: 'SELECT * FROM app_user WHERE username = $1;',
      values: [employeeUsername],
    };
    const [employeeUser] = await client
      .query(userQuery)
      .then(data => data.rows);
    if (!employeeUser) throw new Error(`No employee ${employeeUsername} found`);
    const shiftsQuery = {
      text: `
        SELECT shift.start_time, shift.end_time, app_user.username, app_user.first_name, app_user.last_name
        FROM shift
        LEFT JOIN app_user
        ON shift.app_user_id = app_user.id
        WHERE app_user.username = $1
        ORDER BY shift.start_time ASC;
      `,
      values: [employeeUsername],
    };
    const shifts = await client.query(shiftsQuery).then(data =>
      data.rows.map(row => ({
        username: row.username,
        startTime: row.start_time,
        endTime: row.end_time,
        firstName: row.first_name,
        lastName: row.last_name,
      }))
    );
    console.log(shifts);
    res.json({ res: { shifts } });
  })
);

app.use((err, req, res, next) => {
  res.json({ err: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
