const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getMovies, addMovie, deleteMovie } = require('../controllers/movieController');

router.get('/', getMovies);
router.post('/', protect, admin, upload.single('image'), addMovie);
router.delete('/:id', protect, admin, deleteMovie);

module.exports = router;