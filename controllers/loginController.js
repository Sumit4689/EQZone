const asyncHandler = require("express-async-handler")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require("../models/userModel")

const getloginPage = asyncHandler(async (req, res) => {
    res.render('loginPage', {
        name: req.body.name || '',
        email: req.body.email || '',
        password: req.body.password || '',
        rightPanelActive: false,
    });
});

const loginUser = asyncHandler(async (req,res) =>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            message: 'Email and password required'
        })
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        { 
            id: user._id, 
            email: user.email, 
            name: user.name, 
            username: user.username,
            isAdmin: user.isAdmin 
        },
        process.env.JWT_SECRET,
        { expiresIn: '2d' }
    );
    
    // Set the token as an HTTP-only cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 2 * 24 * 60 * 60 * 1000
    });

    // Send success response with redirect URL based on user role
    res.status(200).json({
        success: true,
        message: 'Login successful',
        redirectUrl: user.isAdmin ? '/Admin/dashboard' : '/EQZone'
    });
})

module.exports = { getloginPage, loginUser }; 
