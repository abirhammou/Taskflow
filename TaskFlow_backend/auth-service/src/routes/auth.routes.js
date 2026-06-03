const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');

router.post('/register', ctrl.register);
router.post('/login',    ctrl.login);
router.get('/validate',  ctrl.validate);
router.get('/users',     ctrl.getAllUsers);
router.get('/users/:id', ctrl.getUserById);
router.get('/profile/:id',      ctrl.getProfile);
router.put('/profile/:id',      ctrl.updateProfile);

module.exports = router;