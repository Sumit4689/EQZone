const express = require('express')
const router = express.Router()
const { getDashboard, deleteUser, deletePreset, uploadPreset, getAllPresets, getUploadPage } = require('../controllers/adminController')
const verifyToken = require('../middelware/Authorizations')
const adminAuth = require('../middelware/adminAuth')
const multer = require('multer')
const upload = multer()

// All routes require both authentication and admin authorization
router.use(verifyToken, adminAuth)

router.get('/dashboard', getDashboard)
router.get('/AllPresets', getAllPresets)
router.delete('/user/:userId', deleteUser)
router.delete('/preset/:presetId', deletePreset)
router.route('/uploadFile').get(getUploadPage).post(upload.single('txtFile'), uploadPreset)

module.exports = router