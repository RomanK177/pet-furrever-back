const express = require('express');
const { requireAuth, requireOwner } = require('../../middlewares/requireAuth.middleware');
const { getPet, getPets, removePet, updatePet, createPet, addComment, addTreat } = require('./pet.controller.js');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getPets);
router.get('/:id', getPet);
router.delete('/:id', requireAuth, requireOwner, removePet);
router.put('/:id', requireAuth, requireOwner, updatePet);
router.post('/', requireAuth, requireOwner, createPet);
router.post('/:id/comments', addComment);
router.post('/:id/treats', addTreat);

module.exports = router;