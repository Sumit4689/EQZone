const express = require('express');
const connectDb = require('./config/dbConnection');
const cookieParser = require('cookie-parser');
const verifyToken = require('./middelware/Authorizations');
const dotenv = require('dotenv').config()
const port = process.env.PORT || 3000
const app = express();
const path = require('path')
connectDb();

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');  // Corrected this line

app.use("/login", require('./routes/loginRoute'))
app.use("/register", require('./routes/registerRoute'))
app.use("/logout", require('./routes/logoutRoute'))

// Add root route that redirects to the main application
app.get('/', (req, res) => {
  res.redirect('/EQZone');
});

app.use("/EQZone", verifyToken, require('./routes/EQZoneRoute'))
app.use("/User", verifyToken, require('./routes/UserRoute'))
app.use("/Admin", verifyToken, require('./routes/AdminRoute'))
app.use("/About",verifyToken, require('./routes/AboutRoute'))

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log("Server is Listening on port http://localhost:" + port + "/EQZone");
  });
}

// Export the app for Vercel
module.exports = app;