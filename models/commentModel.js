const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    presetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    userReactions: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        type: {
            type: String,
            enum: ['like', 'dislike']
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);