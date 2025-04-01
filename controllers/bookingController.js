const Booking = require('../models/Booking');
const Movie = require('../models/Movie');

const bookMovie = async (req, res) => {
  const { movieId, seats } = req.body;
  
  try {
    const movie = await Movie.findById(movieId);
    
    if (!movie){
      return res.status(404).json({ message: 'Movie not found' });
    }
    

    const existingBookings = await Booking.find({ movie: movieId });
    const totalBookedSeats = existingBookings.reduce((sum, booking) => sum + booking.seats, 0);
    
    if(totalBookedSeats + seats > movie.availableSeats){
      return res.status(400).json({ message: 'Not enough seats available' });
    }
    
  
    const userBooking = await Booking.findOne({ 
      user: req.user.id, 
      movie: movieId 
    });
    
    if (userBooking) {
      return res.status(400).json({ message: 'You already have a booking for this movie' });
    }
    
    const booking = new Booking({
      user: req.user.id,
      movie: movieId,
      seats
    });
    
    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    await Booking.deleteOne({ _id: req.params.id });
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'movie',
        options: { lean: true }, // Return plain JS object
        transform: (doc) => {
          if (!doc) {
            return { 
              _id: null,
              title: '[Movie deleted by the admin]',
              isDeleted: true 
            };
          }
          return doc;
        }
      });
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  bookMovie,
  cancelBooking,
  getMyBookings
};