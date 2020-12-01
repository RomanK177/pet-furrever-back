const express = require('express');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
// requireAdmin
const { getUser, getUsers, removeUser, updateUser } = require('./user.controller');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', requireAuth, updateUser);
router.delete('/:id', requireAuth, removeUser);
// requireAdmin

module.exports = router;