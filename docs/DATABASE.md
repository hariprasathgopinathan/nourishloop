# Database Design — Surplus Food Donation Network

> **Note:** This document describes the **planned** data models. The database and Mongoose schemas have not been implemented yet.

---

## 1. Database

- **Engine:** MongoDB
- **Hosting:** MongoDB Atlas (cloud)
- **ODM:** Mongoose (Node.js)

---

## 2. Collections

| Collection   | Description                                |
| ------------ | ------------------------------------------ |
| `users`      | All registered users (donors and NGOs).    |
| `donations`  | All food donation listings.                |

---

## 3. User Model

**Collection:** `users`

| Field              | Type       | Required | Description                                      |
| ------------------ | ---------- | -------- | ------------------------------------------------ |
| `_id`              | ObjectId   | Auto     | MongoDB-generated unique identifier.             |
| `firebaseUid`      | String     | Yes      | Firebase Authentication UID (unique).            |
| `name`             | String     | Yes      | Full name of the user or contact person.         |
| `email`            | String     | Yes      | Email address (unique).                          |
| `phone`            | String     | Yes      | Contact phone number.                            |
| `role`             | String     | Yes      | User role: `DONOR` or `NGO`.                     |
| `organizationName` | String     | Yes      | Name of the restaurant, hotel, NGO, shelter, etc.|
| `address`          | String     | Yes      | Full street address.                             |
| `pincode`          | String     | Yes      | Postal/PIN code for area-based filtering.        |
| `latitude`         | Number     | No       | Latitude coordinate for map placement.           |
| `longitude`        | Number     | No       | Longitude coordinate for map placement.          |
| `createdAt`        | Date       | Auto     | Timestamp when the user was created.             |
| `updatedAt`        | Date       | Auto     | Timestamp when the user was last updated.        |

### User Roles

| Role   | Description                                                  |
| ------ | ------------------------------------------------------------ |
| `DONOR`| A food business that creates and manages donation listings.  |
| `NGO`  | An organization that browses and claims available donations. |

### User Indexes (Planned)

- Unique index on `firebaseUid`.
- Unique index on `email`.
- Index on `role` for role-based queries.
- Index on `pincode` for area-based filtering.

---

## 4. Donation Model

**Collection:** `donations`

| Field             | Type       | Required | Default       | Description                                          |
| ----------------- | ---------- | -------- | ------------- | ---------------------------------------------------- |
| `_id`             | ObjectId   | Auto     |               | MongoDB-generated unique identifier.                 |
| `donorId`         | ObjectId   | Yes      |               | Reference to the donor in the `users` collection.    |
| `foodName`        | String     | Yes      |               | Name of the food item (e.g., "Cooked Rice").         |
| `category`        | String     | Yes      |               | Food category (e.g., "Cooked Food", "Bakery", "Produce"). |
| `quantity`        | Number     | Yes      |               | Amount of food available.                            |
| `unit`            | String     | Yes      |               | Unit of measurement (e.g., "kg", "plates", "packs"). |
| `description`     | String     | No       |               | Additional details about the food.                   |
| `pickupAddress`   | String     | Yes      |               | Address where the food can be picked up.             |
| `pincode`         | String     | Yes      |               | Postal/PIN code for area-based filtering.            |
| `latitude`        | Number     | No       |               | Latitude coordinate for map placement.               |
| `longitude`       | Number     | No       |               | Longitude coordinate for map placement.              |
| `availableUntil`  | Date       | Yes      |               | Deadline by which the food must be picked up.        |
| `status`          | String     | Yes      | `AVAILABLE`   | Current donation status (see status table below).    |
| `claimedBy`       | ObjectId   | No       | `null`        | Reference to the NGO that claimed the donation.      |
| `claimedAt`       | Date       | No       | `null`        | Timestamp when the donation was claimed.             |
| `pickedUpAt`      | Date       | No       | `null`        | Timestamp when the food was picked up.               |
| `createdAt`       | Date       | Auto     |               | Timestamp when the donation was created.             |
| `updatedAt`       | Date       | Auto     |               | Timestamp when the donation was last updated.        |

### Donation Statuses

| Status             | Description                                                |
| ------------------ | ---------------------------------------------------------- |
| `AVAILABLE`        | Donation is listed and open for NGOs to claim.             |
| `CLAIMED`          | An NGO has claimed the donation.                           |
| `READY_FOR_PICKUP` | Donor confirmed food is ready for collection.              |
| `PICKED_UP`        | NGO has collected the food. Donation is complete.          |
| `EXPIRED`          | The `availableUntil` deadline passed without pickup.       |
| `CANCELLED`        | The donor cancelled the donation.                          |

### Valid Status Transitions

```
AVAILABLE ──→ CLAIMED ──→ READY_FOR_PICKUP ──→ PICKED_UP
    │             │
    │             ├──→ CANCELLED (donor cancels after claim)
    │
    ├──→ CANCELLED (donor cancels before claim)
    │
    └──→ EXPIRED (availability window passes)
```

### Donation Indexes (Planned)

- Index on `status` for filtering available donations.
- Index on `donorId` for fetching a donor's own donations.
- Index on `claimedBy` for fetching an NGO's claimed donations.
- Index on `pincode` for area-based filtering.
- Index on `availableUntil` for expiration queries.
- Geospatial index on `[latitude, longitude]` for distance-based queries (if using MongoDB 2dsphere).

---

## 5. Relationships

```
┌──────────────┐          ┌──────────────────┐
│    users     │          │    donations     │
│              │          │                  │
│  _id ◄───────┼──────────┤  donorId         │
│              │          │                  │
│  _id ◄───────┼──────────┤  claimedBy       │
│              │          │                  │
└──────────────┘          └──────────────────┘
```

- **One donor → many donations**: A single donor (user with role `DONOR`) can create multiple donations. Each donation references the donor via `donorId`.
- **One NGO → many claims**: A single NGO (user with role `NGO`) can claim multiple donations. Each claimed donation references the NGO via `claimedBy`.
- **One donation → one donor**: Every donation belongs to exactly one donor.
- **One donation → zero or one NGO**: A donation is either unclaimed (`claimedBy: null`) or claimed by exactly one NGO.

---

## 6. Data Validation Rules (Planned)

### User Validation

- `email` must be a valid email format.
- `role` must be one of: `DONOR`, `NGO`.
- `phone` must be a non-empty string.
- `pincode` must be a valid format for the target region.

### Donation Validation

- `quantity` must be a positive number.
- `availableUntil` must be a future date at the time of creation.
- `status` must be one of the defined statuses.
- `claimedBy` can only be set when status transitions to `CLAIMED`.
- `pickedUpAt` can only be set when status transitions to `PICKED_UP`.
- Status transitions must follow the valid transition graph above.
