const User = require('../models/userModel');

const adminAuth = async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return res.redirect('/login');
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.redirect('/EQZone');
        }
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        res.redirect('/login');
    }
};

module.exports = adminAuth;