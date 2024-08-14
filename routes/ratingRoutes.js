const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addRating, getRatingsForBook } = require('../controllers/ratingController');

const router = express.Router();

router.route('/:bookId')
      .get(protect, getRatingsForBook)
      .post(protect, addRating);

module.exports = router;