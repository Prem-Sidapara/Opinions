const Comment = require('../models/Comment');
const crypto = require('crypto');

// Helper to generate anonymous ID
const getAnonymousId = (userId, opinionId) => {
    return crypto.createHash('sha256').update(`${userId.toString()}_${opinionId.toString()}_OPINION_SECRET`).digest('hex').substring(0, 24);
};

exports.addComment = async (req, res) => {
    try {
        const { content, opinionId, parentId, isAnonymous } = req.body;

        // Check if Opinion exists (optional but good for data integrity)
        // const opinion = await Opinion.findById(opinionId);
        // if (!opinion) return res.status(404).json({ msg: 'Opinion not found' });

        let finalParentId = null;

        if (parentId) {
            const parentComment = await Comment.findById(parentId);
            if (!parentComment) {
                return res.status(404).json({ msg: 'Parent comment not found' });
            }

            // Nesting Logic: Top -> Reply (Depth 1) -> Reply (Depth 2)
            // If parent has no parentId, it is Root (Depth 0). New comment is Depth 1.
            // If parent has parentId, it is Reply (Depth 1). New comment is Depth 2.
            // If parent refers to a comment that refers to another, we need to check chain.

            // Simplification: We only store immediate parent.
            // Check grandparent to determine depth.

            if (parentComment.parentId) {
                // Parent is at least Depth 1.
                // Check if Parent's Parent has a parent (Depth 2 check)
                const grandParent = await Comment.findById(parentComment.parentId);
                if (grandParent && grandParent.parentId) {
                    // Parent is Depth 2. We cannot reply to Depth 2.
                    return res.status(400).json({ msg: 'Maximum comment depth reached' });
                }
                // Allowed. New comment becomes Depth 2.
                finalParentId = parentId;
            } else {
                // Parent is Root (Depth 0). New comment is Depth 1.
                finalParentId = parentId;
            }
        }

        const newComment = new Comment({
            content,
            opinionId,
            parentId: finalParentId,
            userId: req.user.id,
            isAnonymous: isAnonymous || false
        });

        const savedComment = await newComment.save();

        // Return populated structure matching getComments
        const populatedComment = await savedComment.populate('userId', 'username');
        const cObj = populatedComment.toObject();

        if (cObj.isAnonymous) {
            cObj.userId = {
                _id: getAnonymousId(req.user.id, opinionId),
                username: 'Anonymous',
            };
        }

        res.status(201).json(cObj);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const { opinionId } = req.params;
        // Populate userId to get real details first, then mask them if needed
        const comments = await Comment.find({ opinionId })
            .sort({ createdAt: 1 }) // Sort by old to new usually for comments
            .populate('userId', 'username');

        const sanitizedComments = comments.map(c => {
            const cObj = c.toObject();
            if (cObj.isAnonymous) {
                // Mask real user data
                cObj.userId = {
                    _id: getAnonymousId(c.userId._id, opinionId),
                    username: 'Anonymous',
                    // No pfp for anonymous, frontend will generate color from _id
                };
            }
            return cObj;
        });

        res.json(sanitizedComments);
    } catch (err) {
        console.error(err);
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
