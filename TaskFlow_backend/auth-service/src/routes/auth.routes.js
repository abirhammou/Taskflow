const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');


router.get('/users',     ctrl.getAllUsers);
router.get('/users/:id', ctrl.getUserById);
router.get('/profile/:id',      ctrl.getProfile);
router.put('/profile/:id',      ctrl.updateProfile);
router.get('/profile/email/:email', ctrl.getProfileByEmail);

module.exports = router;