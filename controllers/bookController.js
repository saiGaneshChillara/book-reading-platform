const Book = require('../models/Book');
const Rating = require('../models/Rating');
exports.getAllBooks =  async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json(books);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: err.message,
        });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                message: 'Book not found',
            });
        }

        const ratings = Rating.find({ bookId });
        res.json({
            book,
            ratings,
        });

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: err.message,
        });
    }
};

exports.addBook = async (req, res) => {
    try {
        const { title, author, genre, summary, pageCount } = req.body;

        if (!req.files || !req.files.file || !req.files.coverImage) {
            return res.status(400).json({
                message: 'Please upload both book file and cover image',
            });
        }

        const file = req.files.file[0].path;
        const coverImage = req.files.coverImage[0].path;

        const book = new Book({
            title,
            author,
            genre,
            summary,
            file,
            coverImage,
            pageCount,
        });

        await book.save();
        res.status(201).json(book);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: err.message,
        });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const updates = req.body;

        if (req.files && req.files.file) {
            updates.file = req.files.file[0].path;
        }

        if (req.files && req.files.coverImage) {
            updates.coverImage = req.files.coverImage[0].path;
        }

        const { bookId } = req.params;
        const book = await Book.findByIdAndUpdate(bookId, updates, { new: true });

        if (!book) {
            return res.status(404).json({
                message: 'Book not found',
            });
        }

        res.json(book);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: err.message,
        });
    }
};