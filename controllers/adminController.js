const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const File = require('../models/fileModel')
const multer = require('multer')
const path = require('path');


const getDashboard = asyncHandler(async (req, res) => {
    try {
        // Fetch all non-admin users
        const users = await User.find({ isAdmin: false }).select('-password')
        
        res.render('adminPage', {
            users,
            user: req.user,
            isAuthenticated: true
        })
    } catch (error) {
        console.error('Error fetching users:', error)
        res.status(500).send('Error fetching users')
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params
    console.log(userId)
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        
        if (user.isAdmin) {
            return res.status(403).json({ message: 'Cannot delete admin user' })
        }
        
        await user.deleteOne()
        res.json({ success: true, message: 'User deleted successfully' })
    } catch (error) {
        console.error('Delete error:', error)
        res.status(500).json({ success: false, message: 'Error deleting user' })
    }
})

const deletePreset = asyncHandler(async (req, res) => {
    try {
        const { presetId } = req.params;
        
        const preset = await File.findById(presetId);
        if (!preset) {
            return res.status(404).json({ message: 'Preset not found' });
        }
        
        await preset.deleteOne();
        return res.status(200).json({ message: 'Preset deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        return res.status(500).json({ message: 'Error deleting preset', error: error.message });
    }
});

const getAllPresets = asyncHandler(async (req, res) => {
    const presets = await File.find();
    res.render('AdminPresets', {
        presets,
        user: req.user,
        isAuthenticated: true
    });
});

const getUploadPage = asyncHandler(async (req, res) => {
    res.render('AdminUpload', {
        user: req.user,
        isAuthenticated: true
    });
});

const uploadPreset = asyncHandler(async (req, res) => {
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
          uploadedBy: 'EQZONE'
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
})

module.exports = {
    getDashboard,
    deleteUser,
    deletePreset,
    uploadPreset,
    getAllPresets,
    getUploadPage
}