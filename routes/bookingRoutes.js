const express = require('express');
const router = express.Router();
const { protect, user } = require('../middleware/auth');
const { bookMovie, cancelBooking, getMyBookings } = require('../controllers/bookingController');

router.get('/mybookings', protect, user, getMyBookings);
router.post('/', protect, user, bookMovie);
router.delete('/:id', protect, user, cancelBooking);

module.exports = router;