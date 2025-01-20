const express = require('express')
const router = express.Router()
const {registerUser,SignupPage} = require("../controllers/registerController")

router.route("/").post(registerUser).get(SignupPage)

module.exports = router;