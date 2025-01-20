const asyncHandler = require("express-async-handler")
const File = require("../models/fileModel")

const getHomePage = asyncHandler(async (req, res) => {
    const isAuthenticated = !!req.user;
    const user = req.user;

    // Populate the likes array to check if current user has liked each preset
    const presets = await File.find({})
        .populate('likes', '_id') // We only need the user IDs from likes
        .exec();

    res.render('index', {
        isAuthenticated,
        user,
        presets,
    });
});

const downloadFile = asyncHandler(async (req, res) => {
    const fileId = req.params.fileId;
    
    try {
        const file = await File.findById(fileId);
        
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Increment download count
        file.downloadCount += 1;
        await file.save();

        // Set response headers
        res.setHeader('Content-Type', file.fileType);
        res.setHeader('Content-Disposition', `attachment; filename=${file.title}.txt`);
        
        // Send the file
        res.send(file.fileData);

    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ message: 'Error downloading file' });
    }
});

module.exports = {getHomePage, downloadFile} 