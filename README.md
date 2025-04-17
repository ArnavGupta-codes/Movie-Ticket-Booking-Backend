# Movie-Ticket-Booking-Backend

Deployed Portal: [Movie Ticket Booking Backend](https://movie-ticket-booking-backend-41em.onrender.com/)

## API Test/Usage Guide (Test with Postman or similar tools)

### 1. Register a User
**Endpoint:** `POST /api/auth/register`

**Request Body (JSON):**
```json
{
  "username": "usenameee",
  "password": "passwordd"
}
```

**Response:** Returns a token if registration is successful. If the username already exists, it will show an error.

---

### 2. User Login
**Endpoint:** `POST /api/auth/login`

**Request Body (JSON):**
```json
{
  "username": "usenameee",
  "password": "passwordd"
}
```

**Response:** Returns a token if login is successful.

---

### 3. Admin Login
**Endpoint:** `POST /api/auth/admin/login`

**Request Body (JSON):**
```json
{
  "username": "admin",
  "password": "123456"
}
```

**Response:** Returns a token for the admin.

---

### 4. Add Movies (Admin Only)
**Endpoint:** `POST /api/movies`

**Headers:**
- `Authorization: Bearer <admin token>`
- `Content-Type: multipart/form-data`

**Form Data:**
Add appropriate fields and movie image.

**Response:** Adds the movie and returns details.

---

### 5. Get Movies
**Endpoint:** `GET /api/movies`

**Authorization:** Not Required

**Response:** Returns a list of all movies with IDs and available seats.

---

### 6. Make Bookings (User Only)
**Endpoint:** `POST /api/bookings`

**Headers:**
- `Authorization: Bearer <user token>`
- `Content-Type: application/json`

**Request Body (JSON):**
```json
{
  "movieId": "<movie id>",
  "seats": <no.>
}
```

**Response:** Returns booking ID and related information.

---

### 7. Get User Bookings
**Endpoint:** `GET /api/bookings/mybookings`

**Headers:**
- `Authorization: Bearer <user token>`

**Response:** Returns details of all tickets booked by the user.

---

### 8. Delete Booking
**Endpoint:** `DELETE /api/bookings/<booking id>`

**Headers:**
- `Authorization: Bearer <user token>` (must be the one who booked the ticket)

**Response:** Deletes the booking.

---

### 9. Delete Movies (Admin Only)
**Endpoint:** `DELETE /api/movies/<movie id>`

**Headers:**
- `Authorization: Bearer <admin token>`

**Response:** Deletes the movie. If a user booked a ticket for it, the movie is marked as deleted by the admin.

---

## Notes
- Use Postman or a similar API client to test these endpoints.
- Admin has special privileges for movie management.
- Users can register, login, book tickets, and manage their bookings.

---
