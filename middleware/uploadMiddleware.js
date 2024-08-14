const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/books/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname, + '-' + Date.now() + path.extname(file.originalname));
    }
});

function checkFileType(file, cb) {
    const fileTypes = /pdf|epub|jpb|jpeg|png/;
    const extname = fileTypes.test(path.extname(file.originalname)
                                        .toLocaleLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only PDF, EPUB, JPG, JPEG, and PNG files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).fields([
    { name: 'file', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]);

module.exports = upload;