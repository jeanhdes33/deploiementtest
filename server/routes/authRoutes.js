const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, registerUser, loginUser, getProfile, getUser } = require('../controllers/authController');
const { createQuestion, getQuestionsByCategoryAndSubCategory, getRandomFootballQuestion, submitAnswer, getCorrectAnswer } = require('../controllers/questionsController'); // Importer la fonction de contrôleur pour la création de questions, la récupération des questions par catégorie et sous-catégorie, et la récupération d'une question de football aléatoire

// Middleware 
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
);

router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile);
router.get('/user', getUser); // Ajout de la route pour récupérer les informations de l'utilisateur

// Route pour créer une nouvelle question
router.post('/questions', createQuestion);

// Route pour récupérer les questions filtrées par catégorie et sous-catégorie
router.get('/questions', getQuestionsByCategoryAndSubCategory);

// Route pour récupérer une question de football aléatoire
router.get('/questions/football/random', getRandomFootballQuestion);

// Route pour soumettre une réponse à une question
router.post('/questions/:questionId/answers', submitAnswer);

// Route pour récupérer la réponse correcte à une question spécifique
router.get('/questions/:questionId/correct-answer', getCorrectAnswer);

module.exports = router;
