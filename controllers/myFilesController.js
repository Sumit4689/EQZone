const asyncHandler = require('express-async-handler')
const File = require('../models/fileModel');
const multer = require('multer');
const path = require('path');
const User = require('../models/userModel');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'text/plain') {
            return cb(new Error('Only .txt files are allowed'));
        }
        cb(null, true);
    }
}).single('txtFile'); // Make sure this matches your form field name

const getMyFiles = asyncHandler(async (req, res) => {
    const isAuthenticated = !!req.user
    if (!isAuthenticated) {
        return res.redirect('/login')
    }else{
      const user = req.user
      const presets = await File.find({uploadedBy: req.user.username});
      res.render('myfiles', { user, presets, isAuthenticated })
    }
})

const getUploadPage = asyncHandler(async (req, res) => {
    const isAuthenticated = !!req.user
    if (!isAuthenticated) {
        return res.redirect('/login')
    }else{
        const user = req.user
        res.render('uplodFile', { user })
    }
})

const uploadFile = asyncHandler(async (req, res) => {
  try {
    const { fileTitle, fileDescription, iemBrand, iemModel } = req.body;
    const file = req.file;

    const isAuthenticated = !!req.user
    const user = req.user

    // Check if user is authenticated
    if (!isAuthenticated || !user.email) {
      return res.status(401).json({ message: 'User not authenticated or email not found' });
    }

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newFile = new File({
      title: fileTitle,
      description: fileDescription,
      brand: iemBrand,
      model: iemModel,
      fileData: file.buffer,
      fileType: file.mimetype,
      uploadedBy: user.username
    });

    const savedFile = await newFile.save();
    res.json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

const deletePreset = asyncHandler(async (req, res) => {
  const { presetId } = req.params;
  const userEmail = req.user.username;

  try {
      const preset = await File.findById(presetId);
      if (!preset) {
          return res.status(404).json({ message: 'Preset not found' });
      }

      // Check if the user is the uploader
      console.log(preset.uploadedBy.toString())
      if (preset.uploadedBy.toString() !== userEmail) {
          return res.status(403).json({ message: 'You are not authorized to delete this preset' });
      }

      await preset.deleteOne();
      res.status(200).json({ message: 'Preset deleted successfully' });
  } catch (error) {
      console.error('Delete error:', error);
      res.status(400).json({ message: error.message });
  }
});

const getLikedPresets = asyncHandler(async (req, res) => {
    const isAuthenticated = !!req.user;
    if (!isAuthenticated) {
        return res.redirect('/login');
    }

    try {
        const user = req.user;
        // Find all presets that have been liked by the user
        const presets = await File.find({
            'likes': user.id
        }).populate('likes');

        res.render('likedPresets', { 
            user,
            presets,
            isAuthenticated 
        });
    } catch (error) {
        console.error('Error fetching liked presets:', error);
        res.status(500).json({ message: 'Error fetching liked presets' });
    }
});

module.exports = { getMyFiles, getUploadPage, uploadFile, deletePreset, getLikedPresets }

