const Movie = require('../models/Movie');
const Booking = require('../models/Booking');


const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    
    const moviesWithStatus = await Promise.all(movies.map(async movie => {
      const bookings = await Booking.find({ movie: movie._id });
      const totalBookedSeats = bookings.reduce((sum, booking) => sum + booking.seats, 0);
      
      let status;
      if (totalBookedSeats >= movie.availableSeats) {
        status = 'House full';
      } else {
        status = `${movie.availableSeats - totalBookedSeats} seats remaining`;
      }
      
      return {
        ...movie._doc,
        status,
        time: movie.time
      };
    }));
    
    res.json(moviesWithStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


const addMovie = async (req, res) => {
  const { name, availableSeats, date, time } = req.body;
  
  try {
    const movie = new Movie({
      name,
      availableSeats,
      date,
      time,
      image: req.file.path
    });
    
    await movie.save();
    res.json(movie);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await Movie.deleteOne({ _id: req.params.id });

    res.json({ message: "Movie removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMovies,
  addMovie,
  deleteMovie
};