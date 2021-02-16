const express = require('express');
const { requireAuth, requireOwner } = require('../../middlewares/requireAuth.middleware')
const { getAdoptionRequests, getAdoptionRequest, removeAdoptionRequest, updateAdoptionRequest, createAdoptionRequest, sendMessage } = require('./adoption.controller.js');
const router = express.Router();
// middleware that is specific to this router
// router.use(requireAuth)
router.get('/', getAdoptionRequests);
router.post('/', requireAuth, createAdoptionRequest);
router.get('/:id', getAdoptionRequest);
router.delete('/:id', requireAuth, requireOwner, removeAdoptionRequest);
// TODO: Check if need to add requireOwner - can user update the adoption when he delet it?
router.put('/:id', updateAdoptionRequest);
// router.post('/:id/messages', markMessageAsUnread)
router.post('/:id/messages', sendMessage)


module.exports = router;