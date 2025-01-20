const express = require('express')
const router = express.Router()
const {getloginPage,loginUser} = require("../controllers/loginController")

router.route("/").get(getloginPage).post(loginUser)

module.exports = router;