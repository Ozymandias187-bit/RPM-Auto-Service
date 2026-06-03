const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { verificarAdmin } = require('../middleware/authMiddleware');

// Rutas de autenticación y gestión de usuario
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/all', verificarAdmin, userController.getAllUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteAccount);

module.exports = router;