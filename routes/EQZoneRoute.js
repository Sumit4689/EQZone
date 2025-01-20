const express = require('express')
const router = express.Router()
const {getHomePage, downloadFile} = require("../controllers/homePageController")

router.route("/").get(getHomePage)
router.route("/api/files/:fileId/download").get(downloadFile)

module.exports = router;