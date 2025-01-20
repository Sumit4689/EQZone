const express = require('express')
const router = express.Router()
const { getProfilePage, updateProfile, changePassword, deleteAccount} = require('../controllers/profilePageController')
const { getMyFiles, getUploadPage, uploadFile, deletePreset, getLikedPresets } = require('../controllers/myFilesController')
const { getPresetDetails, createComment, deleteComment, handleCommentReaction, handlePresetLike } = require('../controllers/presetController')
const multer = require('multer')
const upload = multer()
const verifyToken = require('../middelware/Authorizations')

router.route('/profilePage').get(getProfilePage)
router.route('/myFiles').get(getMyFiles)
router.route('/likedPresets').get(getLikedPresets)
router.route('/updateProfile').put(updateProfile)
router.route('/changePassword').put(changePassword)
router.route('/deleteAccount').delete(deleteAccount)
router.route('/uploadFile').get(getUploadPage).post(upload.single('txtFile'), uploadFile)
router.route('/deletePreset/:presetId').delete(deletePreset)
router.route('/preset/:fileId').get(getPresetDetails)

// Comment routes with proper endpoints and middleware
router.route('/api/comments')
    .post(verifyToken, createComment);

router.route('/api/comments/:commentId')
    .delete(verifyToken, deleteComment);

router.route('/api/comments/:commentId/reaction')
    .post(verifyToken, handleCommentReaction);

router.route('/api/presets/:presetId/like')
    .post(verifyToken, handlePresetLike);

module.exports = router