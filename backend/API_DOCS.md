# Urgent Medicine Reminder API Documentation

## Overview
This API powers the backend for the Urgent Medicine Reminder PWA. It provides user authentication, medication management, log tracking, and data export. All endpoints are RESTful and return JSON.

---

## Base URL
```
http://localhost:5000/api
```

---

## Authentication
- **Register** and **Login** endpoints are public.
- All other endpoints require a JWT in the `Authorization` header:
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```

---

## Data Models

### User
| Field        | Type   | Description                  |
|--------------|--------|------------------------------|
| _id          | ObjectId | Unique user ID              |
| name         | String | User's name                  |
| email        | String | User's email (unique)        |
| passwordHash | String | Hashed password              |
| settings     | Object | Optional user settings       |

### Medication
| Field            | Type     | Description                        |
|------------------|----------|------------------------------------|
| _id              | ObjectId | Unique medication ID               |
| userId           | ObjectId | Reference to User                  |
| name             | String   | Medication name                    |
| dosage           | String   | Dosage (e.g., 500mg)               |
| times            | [String] | Array of times (e.g., ["08:00"])  |
| remindersEnabled | Boolean  | Whether reminders are enabled      |

### Log
| Field        | Type     | Description                        |
|--------------|----------|------------------------------------|
| _id          | ObjectId | Unique log ID                      |
| medicationId | ObjectId | Reference to Medication            |
| userId       | ObjectId | Reference to User                  |
| timestamp    | Date     | When the action occurred           |
| action       | String   | "taken", "missed", or "snoozed"   |

---

## Endpoints

### 1. Auth
#### Register
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "name": "Alice",
    "email": "alice@example.com",
    "password": "password123"
  }
  ```
- **Responses:**
  - `201 Created`: `{ "message": "User registered successfully" }`
  - `400 Bad Request`: `{ "message": "User already exists" }`

#### Login
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "alice@example.com",
    "password": "password123"
  }
  ```
- **Responses:**
  - `200 OK`:
    ```json
    {
      "token": "JWT_TOKEN",
      "user": {
        "id": "...",
        "name": "Alice",
        "email": "alice@example.com",
        "settings": {}
      }
    }
    ```
  - `400 Bad Request`: `{ "message": "Invalid credentials" }`

---

### 2. Medications
#### Get All Medications
- **GET** `/medications/`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response:**
  - `200 OK`: Array of medication objects

#### Create or Update Medication
- **POST** `/medications/`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Body:**
  ```json
  {
    "_id": "optional_for_update",
    "name": "Paracetamol",
    "dosage": "500mg",
    "times": ["08:00", "14:00", "20:00"],
    "remindersEnabled": true
  }
  ```
- **Response:**
  - `200 OK`: Medication object (created or updated)

#### Delete Medication
- **DELETE** `/medications/:id`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response:**
  - `200 OK`: `{ "message": "Medication deleted" }`

---

### 3. Logs
#### Get All Logs
- **GET** `/logs/`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response:**
  - `200 OK`: Array of log objects

#### Sync Logs
- **POST** `/logs/sync`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Body:**
  ```json
  {
    "logs": [
      {
        "medicationId": "...",
        "timestamp": "2024-06-01T08:00:00.000Z",
        "action": "taken"
      }
    ]
  }
  ```
- **Response:**
  - `201 Created`: Array of created log objects

---

### 4. Export
#### Export All Data
- **GET** `/export/`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response:**
  - `200 OK`:
    ```json
    {
      "medications": [ ... ],
      "logs": [ ... ]
    }
    ```

---

## Error Handling
- All errors return JSON in the form:
  ```json
  { "message": "Error description" }
  ```
- Common status codes: `400` (Bad Request), `401` (Unauthorized), `500` (Server Error)

---

## Example Authorization Header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

## Notes
- All times are in 24-hour format (e.g., "08:00").
- All dates/timestamps are ISO 8601 strings (UTC).
- Passwords are never returned by the API.
- All endpoints (except /auth/*) require a valid JWT.

---

## Contact
For questions or issues, contact the backend maintainer. 