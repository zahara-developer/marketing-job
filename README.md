# Marketing & Sales Careers

A full-stack internship-ready careers website built with React, Vite, Express, MongoDB, Mongoose, Framer Motion, and plain CSS.

## Project Structure

```text
project-root/
  client/
    src/
      assets/
        images/
      components/
      pages/
      styles/
      App.jsx
      main.jsx
  server/
    config/
    controllers/
    models/
    routes/
    seed/
    server.js
  .env
  package.json
  README.md
```

## Run Instructions

1. Install dependencies from the project root:

```bash
npm install
```

2. Create a `.env` file in the project root using `.env.example`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
CLIENT_URL=http://localhost:5173
```

3. Seed the database with sample content:

```bash
npm run seed
```

4. Start the backend and frontend together:

```bash
npm run dev
```

5. Open the app:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Individual Commands

- Run only backend: `npm run dev:server`
- Run only frontend: `npm run dev:client`
- Build frontend: `npm run build`
- Start backend in production mode: `npm run start`

## API Endpoints

- `GET /api/roles`
- `GET /api/companies`
- `GET /api/resources`
- `POST /api/applications`

## Notes

- MongoDB must be running locally or accessible through your connection string.
- The frontend uses `VITE_API_URL` if defined; otherwise it defaults to `http://localhost:5000/api`.
