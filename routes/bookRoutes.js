const express = require('express');

const upload = require('../middleware/uploadMiddleware');
const protect = require('../middleware/authMiddleware');
const { getAllBooks, addBook, getBookById } = require('../controllers/bookController');

const router = express.Router();

router.route('/')
      .get(protect, getAllBooks)
      .post(protect, upload, addBook);

router.route('/:bookId')
      .get(protect, getBookById)
      .put(protect, upload, addBook);

//router.route('/my-books')
module.exports = router;