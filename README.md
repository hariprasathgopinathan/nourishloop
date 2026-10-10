# NourishLoop — Surplus Food Donation Network

**Keep Good Food in the Loop.**

## Problem Statement

Every day, enormous quantities of perfectly edible food go to waste at restaurants, hotels, bakeries, and grocery stores. At the same time, millions of people served by NGOs and shelters struggle with food insecurity. The core problem is a **disconnect**: donors have surplus food but no efficient way to reach organizations that can distribute it, and NGOs have no streamlined way to discover and claim available food before it expires.

**NourishLoop** bridges this gap by providing a real-time platform where donors can list surplus food and nearby NGOs can discover, claim, and pick it up — reducing food waste and feeding communities.

---

## Features

- Firebase Authentication and role-based Donor/NGO profiles
- Donation posting and donor donation management
- Nearby donation discovery and NGO claims
- Donation lifecycle and pickup tracking
- MapLibre GL JS and OpenStreetMap-based maps
- Authorized pickup routing through the existing routing service
- Socket.IO notifications
- Existing donor/NGO dashboards and impact views
- Responsive landing page and authenticated portal interfaces
- Profile, settings, and support views

---

## Technology Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React, Vite, JavaScript, Tailwind CSS |
| **Backend** | Node.js, Express.js, JavaScript |
| **Database** | MongoDB Atlas and Mongoose |
| **Authentication** | Firebase Authentication and Firebase Admin SDK |
| **Real-time notifications** | Socket.IO |
| **Maps** | MapLibre GL JS and OpenStreetMap |
| **Routing** | Existing backend routing integration |
| **Frontend hosting** | Firebase Hosting |
| **Backend hosting** | Render |
| **Version Control** | Git and GitHub |

---

## Production Deployment

- **Frontend (Firebase Hosting):** https://nourishloop.web.app
- **Backend Health Check (Render):** https://nourishloop-api.onrender.com/api/health
- **Database:** MongoDB Atlas

*Note: The frontend is deployed to Firebase Hosting, the backend runs on Render, and application data is securely stored in MongoDB Atlas. The core application is fully deployed and operational. Final end-to-end production verification is pending.*

---

## Development Milestones

| Milestone | Status |
| --- | --- |
| Project foundation and documentation | ✅ Complete |
| Backend and database integration | ✅ Complete |
| Authentication and user profiles | ✅ Complete |
| Donation workflows and claim lifecycle | ✅ Complete |
| Maps, nearby discovery, and pickup routing | ✅ Complete |
| Real-time notifications and security | ✅ Complete |
| Frontend UI/UX implementation | ✅ Complete |
| Firebase Hosting and Render deployment | ✅ Complete |
| Final end-to-end production verification | ⬜ Pending |

---

## Architecture & Request Flow

The frontend React application communicates with the Node/Express backend via a REST API for standard operations (donations, profiles) and via Socket.IO for real-time notifications. The backend verifies Firebase ID tokens through the Firebase Admin SDK, interacts with MongoDB, and proxies mapping and routing requests securely.

## Repository Structure

- `/frontend`: React + Vite SPA
- `/backend`: Node + Express API
- `/docs`: Additional project documentation

---

## Local Setup

1. Clone the repository.
2. **Backend:** 
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. **Frontend:** 
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Environment Variables

You must supply the following environment variables in `.env` files. **Do NOT commit local environment files to version control.**

**Backend (`backend/.env`):**
- `PORT`
- `MONGODB_URI`
- `FRONTEND_ORIGIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `OSRM_BASE_URL`

**Frontend (`frontend/.env`):**
- `VITE_API_BASE_URL`
- `VITE_API_URL`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

---

## Testing

- **Backend:** `cd backend && npm test`
- **Frontend Linting:** `cd frontend && npm run lint`

---

## Security Notes

- API endpoints are protected using Firebase ID tokens and verified via Firebase Admin SDK.
- Secret keys and database URIs must be injected via environment variables in production.
- Firebase Hosting is configured to handle Single Page Application (SPA) routing securely.
