const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    readingProgress: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
        },
        currentPage: {
            type: Number,
            default: 0,
        },
        bookMarkedPage: {
            type: Number,
            default: 0,
        },
        completed: {
            type: Boolean,
            default: false,
        }
    }],
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    }]
});

userSchema.pre('save', async function() {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

userSchema.methods.turnToNextPage = async function(bookId) {
    const readingProgressEntry = this.readingProgress.find(entry => entry.bookId.equals(bookId));
    if (readingProgressEntry) {
        readingProgressEntry.currentPage++;
        await this.save();
    }
};

userSchema.methods.turnToPreviousPage = async function(bookId) {
    const readingProgressEntry = this.readingProgress.find(entry => entry.bookId.equals(bookId));
    if (readingProgressEntry) {
        readingProgressEntry.currentPage--;
        await this.save();
    }
};
userSchema.methods.markPageAsBookmarked = async function(bookId, pageNumber = undefined) {
    const readingProgressEntry = this.readingProgress.find(entry => entry.bookId.equals(bookId));
    if (readingProgressEntry) {
        readingProgressEntry.bookMarkedPage = pageNumber !== undefined ? pageNumber : readingProgressEntry.currentPage;
        await this.save();
    }
};

userSchema.methods.markAsCompleted = async function(bookId) {
    const readingProgressEntry = this.readingProgress.find(entry => entry.bookId.equals(bookId));
    if (readingProgressEntry) {
        readingProgressEntry.completed = true;
        await this.save();
    }
};

userSchema.methods.addFavorite = async function(bookId) {
    const existingFavorite = this.favorites.find(favorite => favorite.equals(bookId));
    if (!existingFavorite) {
        this.favorites.push(bookId);
        await this.save();
    }
};

userSchema.methods.removeFavorite = async function(bookId) {
    this.favorites = this.favorites.filter(favorite =>!favorite.equals(bookId));
    await this.save();
};

userSchema.methods.getReadingProgressForBook = function(bookId) {
    return this.readingProgress.find(entry => entry.bookId.equals(bookId));
};
const User = mongoose.model('User', userSchema);

module.exports = User;