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

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        //Check if user is owner of the comment
        if (comment.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await comment.deleteOne();
        res.json({ msg: 'Comment removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Comment not found' });
        }
        res.status(500).send('Server Error');
    }
};
