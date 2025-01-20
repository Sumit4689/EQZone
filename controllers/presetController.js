const asyncHandler = require("express-async-handler")
const File = require("../models/fileModel")
const Comment = require("../models/commentModel")
const User = require("../models/userModel")

const getPresetDetails = asyncHandler(async (req, res) => {
    const presetId = req.params.fileId;
    const isAuthenticated = !!req.user;

    try {
        const preset = await File.findById(presetId);
        // Get comments and sort by likes in descending order
        const comments = await Comment.find({ presetId })
            .populate('userId', 'name')
            .sort({ likes: -1 });
        
        if (!preset) {
            return res.status(404).send('Preset not found');
        }

        res.render('presetDetails', {
            preset,
            comments,
            isAuthenticated,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Post a new comment
const createComment = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const { presetId, content } = req.body;
    
    if (!presetId || !content) {
        return res.status(400).json({ message: 'PresetId and content are required' });
    }

    try {
        const comment = await Comment.create({
            presetId,
            userId: req.user.id,
            content,
            likes: 0,
            dislikes: 0
        });

        // Populate user information before sending response
        const populatedComment = await Comment.findById(comment._id)
            .populate('userId', 'name')
            .exec();

        // Add comment to the file's comments array
        await File.findByIdAndUpdate(presetId, {
            $push: { comments: comment._id }
        });

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error('Create comment error:', error);
        res.status(400).json({ message: error.message });
    }
});

// Handle comment reaction
const handleCommentReaction = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user has already reacted
        const existingReaction = comment.userReactions.find(
            reaction => reaction.userId.toString() === userId
        );

        if (existingReaction) {
            if (existingReaction.type === type) {
                // User is trying to do the same reaction again - remove it
                if (type === 'like') comment.likes -= 1;
                if (type === 'dislike') comment.dislikes -= 1;
                comment.userReactions = comment.userReactions.filter(
                    reaction => reaction.userId.toString() !== userId
                );
            } else {
                // User is changing their reaction
                if (type === 'like') {
                    comment.likes += 1;
                    comment.dislikes -= 1;
                } else {
                    comment.likes -= 1;
                    comment.dislikes += 1;
                }
                existingReaction.type = type;
            }
        } else {
            // New reaction
            if (type === 'like') comment.likes += 1;
            if (type === 'dislike') comment.dislikes += 1;
            comment.userReactions.push({ userId, type });
        }

        await comment.save();
        res.json({
            likes: comment.likes,
            dislikes: comment.dislikes,
            userReaction: type
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the user is authorized to delete the comment
        if (comment.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        // Remove comment from the preset's comments array
        await File.findByIdAndUpdate(comment.presetId, {
            $pull: { comments: commentId }
        });

        await Comment.findByIdAndDelete(commentId);
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//LikePreset
const handlePresetLike = asyncHandler(async (req, res) => {
    const { presetId } = req.params;
    const userId = req.user.id;

    try {
        const preset = await File.findById(presetId);
        if (!preset) {
            return res.status(404).json({ message: 'Preset not found' });
        }

        // Convert likes array to strings for comparison
        const userIndex = preset.likes.findIndex(id => id.toString() === userId.toString());
        let isLiked = false;

        if (userIndex === -1) {
            // User hasn't liked - add like
            preset.likes.push(userId);
            preset.likeCount = (preset.likeCount || 0) + 1;
            isLiked = true;

            // Add preset to user's liked presets
            await User.findByIdAndUpdate(userId, {
                $addToSet: { likedPresets: presetId }
            });
        } else {
            // User already liked - remove like
            preset.likes.splice(userIndex, 1);
            preset.likeCount = Math.max((preset.likeCount || 1) - 1, 0);
            isLiked = false;

            // Remove preset from user's liked presets
            await User.findByIdAndUpdate(userId, {
                $pull: { likedPresets: presetId }
            });
        }

        await preset.save();
        res.json({
            likeCount: preset.likeCount,
            isLiked
        });
    } catch (error) {
        console.error('Like error:', error);
        res.status(400).json({ message: error.message });
    }
});


module.exports = { getPresetDetails, createComment, deleteComment, handleCommentReaction, handlePresetLike }; 