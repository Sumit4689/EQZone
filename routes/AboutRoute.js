const express = require('express')
const router = express.Router()
const { getAboutPage } = require("../controllers/AboutPageController")

router.route("/").get(getAboutPage)

module.exports = router;