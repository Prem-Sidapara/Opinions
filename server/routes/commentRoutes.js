const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// @route   POST api/comments
// @desc    Add a comment
// @access  Private
router.post('/', auth, commentController.addComment);

// @route   GET api/comments/:opinionId
// @desc    Get all comments for an opinion
// @access  Public
router.get('/:opinionId', commentController.getComments);

// @route   DELETE api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', auth, commentController.deleteComment);

module.exports = router;
