const mongoose = require('mongoose');
const Book = require('./Book');

const ratingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    review: {
        type: String,
        required: true,
        maxlength: 500,
    }
});

ratingSchema.pre('save', async function() {
    const book = await Book.findById(this.bookId);
    if (book) {
        book.calculateAverageRating();
    }
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;