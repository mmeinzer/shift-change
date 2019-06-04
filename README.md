A `.env` with DB connection information is require to connect to the persistent postgreSQL instance
# How to run
- `git clone https://github.com/mmeinzer/shift-change.git`
- The `.env` file containing database connection info and the app secret should be moved into `shift-change/backend/`
- Start the backend: `cd shift-change/backend/ && npm i && npm run dev`
- In a seperate terminal, start the frontend dev server: `cd shift-change/frontend/ && npm i && npm run dev`
- Open a browser at `localhost:8000` and use one of the provided logins (mikemanager, or ericemployee) to use the application
