const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, registerUser, loginUser, getProfile, getUser, updateUserScore, getUserRanking } = require('../controllers/authController');
const { createQuestion, getQuestionsByCategoryAndSubCategory, getRandomFootballQuestion, submitAnswer, getCorrectAnswer } = require('../controllers/questionsController');

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

router.post('/questions', createQuestion);
router.get('/questions', getQuestionsByCategoryAndSubCategory);
router.get('/questions/football/random', getRandomFootballQuestion);
router.post('/questions/:questionId/answers', submitAnswer);
router.get('/questions/:questionId/correct-answer', getCorrectAnswer);

module.exports = router;
