# Backend — API & Integrations

About
-----

The backend is a Node.js service that exposes REST endpoints for starting streams, session/chat management, and health checks. It integrates with third-party streaming providers and handles authentication, token management, and provider-specific actions.

Quick start (local)
-------------------

1. Install dependencies:
   ```sh
   cd backend
   yarn install
   ```
2. Start the service:
   ```sh
   node server.js
   ```

3. Environment variables:
   - `AGORA_APP_ID`, `AGORA_CUSTOMER_SECRET`, `MONGO_URI`, etc. See `.env.example` in `/backend`.
# Backend Service (Node.js)

## Build & Run with Docker

1. Build the backend image:
   ```sh
   docker build -t vmchat-backend .
   ```
2. Run the backend container:
   ```sh
   docker run -p 3000:3000 --env-file .env vmchat-backend
   ```

## Environment Variables
- AGORA_APP_ID
- CUSTOMER_KEY
- CUSTOMER_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET

Set these in your `.env` file or pass them as `-e` flags.

---

For development, use `yarn dev` or `node server.js` locally.
