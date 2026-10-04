# Architecture — Surplus Food Donation Network

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                   CLIENT                        │
│         React + Vite + JavaScript               │
│         Tailwind CSS for styling                │
│         TanStack Query for server state         │
│         Zustand for client state (when needed)  │
│         Deployed on Vercel                      │
└──────────────────────┬──────────────────────────┘
                       │
                       │  REST API (HTTP)
                       │  Socket.IO (WebSocket)
                       │
┌──────────────────────▼──────────────────────────┐
│                   SERVER                        │
│         Node.js + Express.js + JavaScript       │
│         Firebase Admin SDK (token verification) │
│         Socket.IO server (realtime events)      │
│         Deployed on Render                      │
└──────────────────────┬──────────────────────────┘
                       │
                       │  Mongoose ODM
                       │
┌──────────────────────▼──────────────────────────┐
│                  DATABASE                       │
│         MongoDB Atlas (cloud-hosted)            │
│         Collections: users, donations           │
└─────────────────────────────────────────────────┘
```

---

## 2. Request Flow

```
User action in browser
        ↓
React component triggers TanStack Query mutation/query
        ↓
HTTP request (with Firebase ID token in Authorization header)
        ↓
Express middleware verifies token via Firebase Admin SDK
        ↓
Express route handler processes the request
        ↓
Mongoose model reads/writes to MongoDB Atlas
        ↓
Response returned to client
        ↓
TanStack Query updates the UI cache
```

---

## 3. Layer Responsibilities

### Frontend (React + Vite + JavaScript)

| Responsibility              | Details                                                    |
| --------------------------- | ---------------------------------------------------------- |
| User interface              | Render pages, forms, lists, maps, and notifications.       |
| Routing                     | Client-side routing for donor and NGO views.               |
| Authentication UI           | Login, registration, and session management via Firebase.  |
| Server state management     | TanStack Query for fetching, caching, and syncing API data.|
| Client state management     | Zustand for local UI state only when truly needed.         |
| Realtime event handling     | Socket.IO client listens for server-pushed events.         |
| Map rendering               | MapLibre GL JS for displaying donation locations using OpenStreetMap data. |

### Backend (Node.js + Express.js + JavaScript)

| Responsibility              | Details                                                    |
| --------------------------- | ---------------------------------------------------------- |
| REST API                    | Expose endpoints for users, donations, and claims.         |
| Authentication middleware   | Verify Firebase ID tokens on every protected request.      |
| Authorization               | Enforce role-based access (DONOR vs NGO).                  |
| Business logic              | Validate donation workflows, status transitions, and claims.|
| Database interaction        | Read/write to MongoDB via Mongoose models.                 |
| Realtime event emission     | Emit Socket.IO events when donations are created, claimed, or updated. |
| Error handling              | Consistent error responses with appropriate HTTP status codes. |

### Database (MongoDB Atlas + Mongoose)

| Responsibility              | Details                                                    |
| --------------------------- | ---------------------------------------------------------- |
| Persistent storage          | Store users, donations, and related data.                  |
| Schema enforcement          | Mongoose schemas define structure, validation, and defaults. |
| Indexing                    | Indexes on frequently queried fields (status, donorId, pincode, location). |
| Data integrity              | Mongoose middleware and validators enforce business rules.  |

### Authentication (Firebase)

| Responsibility              | Details                                                    |
| --------------------------- | ---------------------------------------------------------- |
| User registration           | Firebase Authentication handles account creation.          |
| User login                  | Firebase issues ID tokens upon successful login.           |
| Token verification          | Backend verifies ID tokens using Firebase Admin SDK.       |
| Session management          | Firebase SDK on the frontend manages token refresh.        |

> **Note:** Firebase stores only authentication credentials. Application-specific user data (name, role, organization, location) is stored in MongoDB.

### Realtime Communication (Socket.IO)

| Responsibility              | Details                                                    |
| --------------------------- | ---------------------------------------------------------- |
| Bidirectional communication | WebSocket connection between client and server.            |
| Event-driven notifications  | Server pushes events for new donations, claims, status changes. |
| Room-based targeting        | Users join rooms based on role or location for scoped notifications. |
| Connection management       | Handle connect, disconnect, and reconnection gracefully.   |

### Location Services (Open-Source OSM Architecture)

| Responsibility              | Details                                                    |
| --------------------------- | ---------------------------------------------------------- |
| Map display                 | **MapLibre GL JS** showing **OpenStreetMap (OSM)** data.   |
| Geocoding                   | **Nominatim** (initially) for address-to-coordinate conversion. |
| Routing                     | **OSRM** (initially) for routing and distance calculation. |
| Distance filtering          | Enable NGOs to find nearby donations.                      |

**Provider Abstraction & Future-Proofing:**
Business logic will eventually depend on an internal `LocationService` abstraction (e.g., `geocode()`, `reverseGeocode()`, `calculateDistance()`, `route()`). This ensures the application is not tightly coupled to public Nominatim or OSRM instances, allowing seamless migration to self-hosted providers (like Pelias or self-hosted OSRM) if usage limits are exceeded.

**Location Privacy & Security Principles:**
- Latitude/longitude are the canonical machine-readable location values; address/pincode remain human-readable operational information.
- Do not unnecessarily expose exact private addresses publicly.
- Before an NGO claims a donation, show only the location precision required by the product.
- After an authorized claim, exact pickup information can be revealed to the appropriate parties.
- Never send unnecessary personal/confidential information to public mapping services.
- Do not implement public Nominatim autocomplete.
- Respect provider usage policies and rate limits. Do not assume public OSM/Nominatim infrastructure provides unlimited free production usage.
- Keep provider URLs configurable instead of hardcoding them throughout application code.
- Ensure proper attribution requirements (e.g., "© OpenStreetMap contributors") are visibly met on all map interfaces.
- Do not expose private provider credentials in frontend code. Use HTTPS in production.
- *Note:* The open-source stack is not automatically "100% secure". Application security comes from existing Firebase authentication, backend authorization, validation, rate limiting, HTTPS, controlled data exposure, and provider usage controls.

---

## 4. API Design Principles

- RESTful resource-based endpoints (e.g., `POST /api/donations`, `GET /api/donations`).
- All protected routes require a valid Firebase ID token in the `Authorization: Bearer <token>` header.
- Consistent JSON response format:
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
  ```json
  {
    "success": false,
    "error": { "message": "..." }
  }
  ```
- Proper HTTP status codes: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `500`.

---

## 5. Planned Directory Structure (Future Steps)

```
surplus-food-donation-network/
│
├── docs/
│   ├── REQUIREMENTS.md
│   ├── ARCHITECTURE.md
│   └── DATABASE.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/       ← API client functions
│   │   ├── stores/         ← Zustand stores (if needed)
│   │   └── utils/
│   ├── public/
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/         ← Database, Firebase, env config
│   │   ├── controllers/
│   │   ├── middleware/      ← Auth, error handling
│   │   ├── models/          ← Mongoose models
│   │   ├── routes/
│   │   ├── services/        ← Business logic
│   │   ├── sockets/         ← Socket.IO handlers
│   │   ├── utils/
│   │   └── server.js
│   └── package.json
│
├── .gitignore
├── AGENTS.md
└── README.md
```

---

## 6. Deployment Architecture

```
┌────────────┐       ┌────────────┐       ┌──────────────┐
│   Vercel   │──────▶│   Render   │──────▶│ MongoDB Atlas│
│ (Frontend) │       │ (Backend)  │       │  (Database)  │
└────────────┘       └────────────┘       └──────────────┘
                           │
                     Firebase Auth
                     (Token verify)
```

- **Vercel** serves the React SPA with automatic builds from GitHub.
- **Render** hosts the Express API with auto-deploy from GitHub.
- **MongoDB Atlas** provides the managed database cluster.
- **Firebase** handles authentication (external service, no hosting needed).
