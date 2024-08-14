const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { userName, password, role } = req.body;

        let user = User.findOne({ userName });
        if (user) {
            return res.status(400).json({
                message: 'User already exists.',
            });
        }
        user = new User({ userName, password, role });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, 
            { expiresIn: '1h' });
        
        res.status(201).json({
            message: 'User registered successfully.',
            token,
            user,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err.message,
        });
    }
};

exports.login = async (req, res) => {
    try {

        const { userName, password } = req.body;
        
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid userName',
            });
        }
        
        const isMatch = await bcrypt.compare(password
            , user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid password',
            });
        }
    
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.json({
            message: 'User logged in successfully.',
            token,
            user,
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message: err.message,
        });
    }
};