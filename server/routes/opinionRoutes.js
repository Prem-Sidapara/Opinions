const express = require('express');
const router = express.Router();
const opinionController = require('../controllers/opinionController');
const auth = require('../middleware/auth');

router.post('/', auth, opinionController.createOpinion);
router.get('/', opinionController.getOpinions);
router.get('/:id', opinionController.getOpinionById);
router.put('/:id/interact', auth, opinionController.interactOpinion);
// router.delete('/:id', auth, opinionController.deleteOpinion); // TODO: Implement delete

module.exports = router;
