const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
    try {
        const { content, opinionId, parentId, isAnonymous } = req.body;

        const newComment = new Comment({
            content,
            opinionId,
            parentId: parentId || null,
            userId: req.user.id,
            isAnonymous: isAnonymous || false
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const { opinionId } = req.params;
        const comments = await Comment.find({ opinionId }).populate('userId', 'username');

        const sanitizedComments = comments.map(c => {
            const cObj = c.toObject();
            if (cObj.isAnonymous) cObj.userId = null;
            return cObj;
        });

        res.json(sanitizedComments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
