const asyncHandler = require("express-async-handler")

const getAboutPage = asyncHandler(async (req, res) => {
    const isAuthenticated = !!req.user;
    const user = req.user;

    res.render('AboutPage', {
        isAuthenticated,
        user,
    });
});

module.exports = {
    getAboutPage,
}
