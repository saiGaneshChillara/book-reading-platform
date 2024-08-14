const mongoose = require('mongoose');
const Rating = require('./Rating');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    }, 
    author: {
        type: String,
        required: true,
        trim: true,
    },
    genre: {
        type: String,
        required: true,
        trim: true,
    },
    summary: {
        type: String,
    },
    file: {
        type: String,
        required: true,
    },
    publishedDate: {
        type: Date,
        default: Date.now,
    },
    pageCount: {
        type: Number,
        required: true,
        default: 0,
    },
    averageRating: {
        type: Number,
        default: 0,
        validate: [
            {
                validator: (v) => v >= 0 && v <= 5,
                message: 'Rating must be between 0 and 5',
            },
        ],
    },
    coverPage: {
        type: String,
    }
});

bookSchema.methods.calculateAverageRating = async function() {
    const ratings = await Rating.find({ book: this._id });
    if (ratings.length > 0) {
        const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        this.averageRating = totalRating / ratings.length;
    } else {
        this.averageRating = 0;
    }
    await this.save();
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;