const express = require('express');
const {requireAuth, requireOwner}  = require('../../middlewares/requireAuth.middleware')
const {getAdoptionRequests, getAdoptionRequest, removeAdoptionRequest, updateAdoptionRequest, createAdoptionRequest} = require('./adoption.controller.js');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getAdoptionRequests);
router.get('/:id', getAdoptionRequest);
router.delete('/:id',requireAuth, requireOwner, removeAdoptionRequest);
// TODO: Check if need to add requireOwner - can user update the adoption when he delet it?
router.put('/:id',requireAuth, updateAdoptionRequest);
router.post('/', requireAuth, createAdoptionRequest);

module.exports = router;