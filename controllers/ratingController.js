const Rating = require('../models/Rating');
const Book = require('../models/Book');

exports.addRating = async (req, res) => {
    try {
        const { rating, review } = req.body;
        const { bookId } = req.params;
        const userId = req.user._id;

        const newRating = new Rating({
            userId,
            bookId,
            rating,
            review,
        });

        await newRating.save();
        res.status(201).json(newRating);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: err.messge,
        });
    }
};

exports.getRatingsForBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const ratings = await Rating.find({ bookId })
                                    .populate('userId', 'userName');
        return res.json(ratings);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: err.messge,
        });
    }
};

exports.getUserRatings = async (req, res) => {
    const userId = req.user._id;

    try {
        const ratings = await Rating.find({ userId })
                                    .populate('bookId', 'title');
        return res.json(ratings);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: err.messge,
        });
    }
};