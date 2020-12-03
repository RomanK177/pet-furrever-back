const express = require('express');
const {getPet, getPets, removePet, updatePet, createPet, addComment, addTreat} = require('./pet.controller.js');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getPets);
router.get('/:id', getPet);
router.delete('/:id', removePet);
router.put('/:id', updatePet);
router.post('/', createPet);
router.post('/:id/comments', addComment);
router.post('/:id/treats', addTreat);

module.exports = router;