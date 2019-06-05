**A `.env` file with Postgres connection information is required to properly connect to the persistent PostgreSQL instance**

## Technology Used
- Express JS for route handlers and middleware
- PostgreSQL database and `node-postgres` for db connection and queries
- Gatsby/React for frontend application

## How to run
- `git clone https://github.com/mmeinzer/shift-change.git`
- The `.env` file containing database connection info and the app secret should be moved into `shift-change/backend/`
- Start the backend: `cd shift-change/backend/ && npm i && npm run dev`
- In a seperate terminal, start the frontend dev server: `cd shift-change/frontend/ && npm i && npm run dev`
- Open a browser at `localhost:8000` and use one of the provided logins (mikemanager, or ericemployee) to use the application

## Next Steps / Areas to Improve
- Refactor express middleware into individual files by endpoint
- Put frontend data fetching endpoint urls into environment variables for easier deployment
