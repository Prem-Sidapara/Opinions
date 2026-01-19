const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        maxlength: 200, // Short comments
    },
    opinionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opinion',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    },
    isAnonymous: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


// Index for faster virtual population of commentsCount
CommentSchema.index({ opinionId: 1 });

module.exports = mongoose.model('Comment', CommentSchema);
