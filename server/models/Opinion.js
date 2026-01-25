const mongoose = require('mongoose');

const OpinionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        maxlength: 2000, // Increased limit for detailed opinions
    },
    title: {
        type: String,
        required: true,
        maxlength: 100,
    },
    topic: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    helpful: {
        type: Number,
        default: 0,
    },
    notHelpful: {
        type: Number,
        default: 0,
    },
    likedBy: {
        type: [String], // UserIDs
        default: [],
    },
    dislikedBy: {
        type: [String], // UserIDs
        default: [],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ip: {
        type: String, // Keeping for audit
        required: true,
    },
    isAnonymous: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for Comment Count
OpinionSchema.virtual('commentsCount', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'opinionId',
    count: true
});


// Indexes for common queries
OpinionSchema.index({ createdAt: -1 }); // For "Latest" sort
OpinionSchema.index({ views: -1 });     // For "Most Viewed" sort
OpinionSchema.index({ topic: 1, createdAt: -1 }); // For filtering by topic + sort
OpinionSchema.index({ topic: 1, views: -1 });     // For filtering by topic + sort
OpinionSchema.index({ userId: 1 });     // For "My Opinions"

module.exports = mongoose.model('Opinion', OpinionSchema);
