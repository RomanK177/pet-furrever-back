const express = require('express');
const {getAdoption, getAdoptions, removeAdoption, updateAdoption, createAdoption} = require('./adoption.controller.js');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getAdoptions);
router.get('/:id', getAdoption);
router.delete('/:id', removeAdoption);
router.put('/:id', updateAdoption);
router.post('/', createAdoption);

module.exports = router;