# Requirements — Surplus Food Donation Network

---

## 1. Project Objective

Build a web platform that enables food businesses (donors) to list surplus food and allows NGOs/shelters to discover, claim, and pick up that food — reducing food waste and addressing food insecurity.

---

## 2. Problem Being Solved

- **Food waste**: Restaurants, hotels, bakeries, and grocery stores routinely discard large volumes of edible surplus food.
- **Food insecurity**: NGOs and shelters serving vulnerable communities often lack reliable access to fresh food donations.
- **Coordination gap**: There is no efficient, real-time channel for donors to broadcast available food or for NGOs to find and claim it before it expires.

This platform solves the coordination problem by providing a centralized, real-time donation marketplace.

---

## 3. Target Users

### Donors

Food businesses that generate surplus food, including:

- Restaurants
- Hotels
- Grocery stores
- Bakeries
- Catering services
- Corporate cafeterias
- Event organizers

### NGOs / Shelters

Organizations that collect and distribute food to people in need, including:

- Non-governmental organizations (NGOs)
- Homeless shelters
- Community kitchens
- Food banks
- Charitable trusts

---

## 4. Donor Responsibilities

- Register with valid organization details and location.
- Create accurate donation listings with food name, category, quantity, and pickup window.
- Keep donation information up to date (cancel if food is no longer available).
- Prepare food for pickup once an NGO claims the donation.
- Ensure food safety and hygiene standards are met.

---

## 5. NGO Responsibilities

- Register with valid organization details and location.
- Browse available donations and claim only what the organization can realistically pick up.
- Pick up claimed donations within the specified availability window.
- Confirm pickup after collection.

---

## 6. Core Donation Workflow

```
Donor creates a donation listing
        ↓
Donation is visible to all NGOs (status: AVAILABLE)
        ↓
An NGO claims the donation (status: CLAIMED)
        ↓
Donor prepares food for pickup (status: READY_FOR_PICKUP)
        ↓
NGO picks up the food (status: PICKED_UP)
```

Alternative flows:

- **Donor cancels** → status changes to `CANCELLED` at any point before pickup.
- **Availability expires** → status changes to `EXPIRED` if no NGO claims it in time.

---

## 7. Donation Statuses

| Status             | Description                                                |
| ------------------ | ---------------------------------------------------------- |
| `AVAILABLE`        | Donation is listed and open for NGOs to claim.             |
| `CLAIMED`          | An NGO has claimed the donation but has not picked it up.  |
| `READY_FOR_PICKUP` | Donor has confirmed the food is ready for the NGO to collect. |
| `PICKED_UP`        | The NGO has collected the food. Donation is complete.      |
| `EXPIRED`          | The availability window passed without the donation being claimed or picked up. |
| `CANCELLED`        | The donor cancelled the donation.                          |

---

## 8. Notification Requirements

The system must notify relevant users in real time when:

- A new donation is created (notify nearby NGOs).
- A donation is claimed by an NGO (notify the donor).
- A donation status changes (notify both donor and the claiming NGO).
- A donation is cancelled (notify the claiming NGO, if any).

Notifications will be delivered via Socket.IO for real-time, in-app updates.

---

## 9. Location Requirements

- Donors must provide their pickup address, pincode, latitude, and longitude when creating a donation.
- NGOs should be able to see donations on a map and filter by distance or pincode.
- An open-source OSM-based mapping architecture (MapLibre GL JS, OpenStreetMap, Nominatim) will be used for geocoding and map display.

---

## 10. Authentication Requirements

- Users register and log in via **Firebase Authentication**.
- Supported auth methods for MVP: **email/password**.
- The backend verifies Firebase ID tokens using **Firebase Admin SDK**.
- User roles (`DONOR` or `NGO`) are assigned at registration and stored in the application database.
- Role-based access control:
  - Only donors can create and cancel donations.
  - Only NGOs can claim donations.

---

## 11. MVP Features

### Donor Features

| Feature           | Description                                              |
| ----------------- | -------------------------------------------------------- |
| Register          | Create a donor account with organization details.        |
| Login             | Authenticate with email and password.                    |
| Create donation   | List surplus food with details, quantity, and pickup info.|
| View own donations| See a list of all donations the donor has created.       |
| Cancel donation   | Cancel an active donation that has not been picked up.   |

### NGO Features

| Feature              | Description                                                 |
| -------------------- | ----------------------------------------------------------- |
| Register             | Create an NGO account with organization details.            |
| Login                | Authenticate with email and password.                       |
| View available donations | Browse all donations with status `AVAILABLE`.           |
| Filter donations     | Filter donations by category, pincode, or distance.         |
| Claim donation       | Claim an available donation for pickup.                     |
| View claimed donations | See a list of all donations the NGO has claimed.          |

### System Features

| Feature                  | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| Authentication           | Firebase-based user authentication and token validation.|
| Donation database        | Persistent storage of all donations with full lifecycle.|
| Donation status management | Enforce valid status transitions.                     |
| Claim validation         | Ensure only one NGO can claim a donation at a time.     |
| Realtime notifications   | Push updates to connected users via Socket.IO.          |

---

## 12. Future Features (Post-MVP)

These features are **not part of the MVP** and should not be implemented until explicitly requested:

- **Donation history & analytics** — Dashboard with statistics for donors and NGOs.
- **Ratings & feedback** — NGOs can rate donors and vice versa.
- **Push notifications** — Browser or mobile push notifications.
- **Admin panel** — Platform admin dashboard for oversight and moderation.
- **Multi-language support** — Localization for different regions.
- **Recurring donations** — Donors can schedule regular donations.
- **Route optimization** — Suggested pickup routes for NGOs with multiple claims.
- **SMS/email notifications** — Fallback notifications outside the app.
- **Food safety certifications** — Verified donor badges.
