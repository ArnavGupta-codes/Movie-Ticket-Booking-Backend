require('dotenv').config(); // Ensure environment variables are loaded
const jwt = require('jsonwebtoken');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjdlODJkMjgzMWIxNmQyNTA3ODY0NzEzIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTc0MzUyNTQ0NSwiZXhwIjoxNzQ2MTE3NDQ1fQ.2Nl7ucQYftK3SyCjq2xnuHyvTehwZlS5eUzS1oCHOSo"; // Replace with your actual token
const secret = process.env.JWT_SECRET; // Ensure it matches your backend

try {
    const decoded = jwt.verify(token, secret);
    console.log("Decoded Token:", decoded);
} catch (error) {
    console.error("Error decoding token:", error.message);
}
