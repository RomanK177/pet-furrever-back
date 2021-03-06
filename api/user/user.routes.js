const express = require('express');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { getUser, getUsers, removeUser, updateUser, addReview, updateFavorites } = require('./user.controller');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', requireAuth, updateUser);
router.delete('/:id', requireAuth, removeUser);
router.post('/:id/reviews', addReview);
// router.post('/:id/favorites', requireAuth, updateFavorites );

module.exports = router;