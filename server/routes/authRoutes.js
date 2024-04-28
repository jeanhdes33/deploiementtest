const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route de test
router.get('/test', authController.test);

// Route pour l'enregistrement d'un utilisateur
router.post('/register', authController.registerUser);

// Route pour la connexion d'un utilisateur
router.post('/login', authController.loginUser);

// Route pour récupérer le profil de l'utilisateur
router.get('/profile', authController.getProfile);

// Route pour récupérer les informations d'un utilisateur
router.get('/user', authController.getUser);

// Route pour mettre à jour le score de l'utilisateur
router.put('/user/update-score', authController.updateUserScore);

// Route pour récupérer le classement de l'utilisateur
router.get('/user-ranking', authController.getUserRanking);

// Route pour récupérer le meilleur score de tous les utilisateurs
router.get('/best-score', authController.getBestScore);

module.exports = router;
