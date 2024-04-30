const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, registerUser, loginUser, getProfile, getUser, updateUserScore, getUserRanking, getBestScore } = require('../controllers/authController');
const { createQuestion, getQuestionsByCategoryAndSubCategory, getRandomFootballQuestion, getRandomTennisQuestion, getRandomBasketballQuestion, getRandomCinemaQuestion, getRandomHistoireQuestion, getRandomSciencesQuestion, getRandomArtsQuestion, getRandomCultureGeneraleQuestion, submitAnswer, getCorrectAnswer } = require('../controllers/questionsController');

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
router.get('/user', getUser);
router.post('/update-score', updateUserScore);
router.get('/user-ranking', getUserRanking); // Route pour récupérer le classement de l'utilisateur
router.get('/best-score', getBestScore); // Route pour récupérer le meilleur score de tous les utilisateurs

router.post('/questions', createQuestion);
router.get('/questions', getQuestionsByCategoryAndSubCategory);
router.get('/questions/football/random', getRandomFootballQuestion);
router.get('/questions/tennis/random', getRandomTennisQuestion);
router.get('/questions/basketball/random', getRandomBasketballQuestion);
router.get('/questions/cinema/random', getRandomCinemaQuestion); // Route pour obtenir des questions de cinéma aléatoires
router.get('/questions/histoire/random', getRandomHistoireQuestion); // Route pour obtenir des questions d'histoire aléatoires
router.get('/questions/science/random', getRandomSciencesQuestion);
router.get('/questions/arts/random', getRandomArtsQuestion);
router.get('/questions/culture-generale/random', getRandomCultureGeneraleQuestion);  // Route pour obtenir des questions de sciences aléatoires
router.post('/questions/:questionId/answers', submitAnswer);
router.get('/questions/:questionId/correct-answer', getCorrectAnswer);

module.exports = router;
