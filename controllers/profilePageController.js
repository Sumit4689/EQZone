const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const userValidationSchema = require('../validation/userValidationSchema')

const getProfilePage = asyncHandler(async (req, res) => {
    const isAuthenticated = !!req.user

    if (!isAuthenticated) {
        return res.redirect('/login')
    }else{
        const user = req.user
        res.render('profilePage', { 
            user 
        })
    }

})

const updateProfile = asyncHandler(async (req, res) => {
    const { name, email, username } = req.body;
    const isAuthenticated = !!req.user;

    if (!isAuthenticated) {
        return res.redirect('/login');
    }

    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Check and update fields if they are different
    const updates = {};
    if (user.name !== name) updates.name = name;
    if (user.username !== username) updates.username = username;

    if (Object.keys(updates).length > 0) {
        const updateUser = await User.findOneAndUpdate({ email: email }, { $set: updates }, { new: true });
        if (updateUser) {
            return res.json({ message: 'Profile updated successfully' });
        }
    }

    res.json({ message: 'No changes detected' });
});

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, email } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if(newPassword){
        const validation = userValidationSchema.pick({ password: true }).safeParse({ password: newPassword });
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.errors });
        }

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save()
    res.json({ message: 'Password changed successfully' })
})

const deleteAccount = asyncHandler(async (req, res) => {
    const user = req.user
    const deletedUser = await User.findOneAndDelete({ email: user.email })
    if (deletedUser) {
        res.json({ message: 'Account deleted successfully' })
    } else {
        res.status(404).json({ message: 'User not found' })
    }
})

module.exports = { getProfilePage, updateProfile, changePassword, deleteAccount}
