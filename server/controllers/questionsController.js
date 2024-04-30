const Question = require('../models/question');

const createQuestion = async (req, res) => {
    try {
        const { question, options, correctOptionIndex, category, subCategory } = req.body;

        const newQuestion = await Question.create({
            question,
            options,
            correctOptionIndex,
            category,
            subCategory
        });

        res.status(201).json(newQuestion);
    } catch (error) {
        console.error('Erreur lors de la création de la question :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const getQuestionsByCategoryAndSubCategory = async (req, res) => {
    try {
        const { category, subCategory } = req.query;

        const questions = await Question.find({ category, subCategory });

        res.json(questions);
    } catch (error) {
        console.error('Erreur lors de la récupération des questions :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const getRandomFootballQuestion = async (req, res) => {
    try {
        const count = await Question.countDocuments({ category: 'Sports', subCategory: 'Football' });
        const randomIndex = Math.floor(Math.random() * count);
        const randomFootballQuestion = await Question.findOne({ category: 'Sports', subCategory: 'Football' }).skip(randomIndex).limit(1);
        res.json(randomFootballQuestion);
    } catch (error) {
        console.error('Erreur lors de la récupération de la question de football aléatoire :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const getRandomCinemaQuestion = async (req, res) => {
    try {
        const count = await Question.countDocuments({ category: 'Cinéma' });
        const randomIndex = Math.floor(Math.random() * count);
        const randomCinemaQuestion = await Question.findOne({ category: 'Cinéma' }).skip(randomIndex).limit(1);
        res.json(randomCinemaQuestion);
    } catch (error) {
        console.error('Erreur lors de la récupération de la question de cinéma aléatoire :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const submitAnswer = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { selectedOptionIndex } = req.body;

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const correctOptionIndex = question.correctOptionIndex;
        const isCorrect = selectedOptionIndex === correctOptionIndex;

        res.json({ isCorrect });
    } catch (error) {
        console.error('Erreur lors de la soumission de la réponse :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const getCorrectAnswer = async (req, res) => {
    try {
        const { questionId } = req.params;

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const correctOptionIndex = question.correctOptionIndex;
        const correctAnswer = question.options[correctOptionIndex];

        res.json({ correctAnswer });
    } catch (error) {
        console.error('Erreur lors de la récupération de la réponse correcte :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

module.exports = {
    createQuestion,
    getQuestionsByCategoryAndSubCategory,
    getRandomFootballQuestion,
    getRandomCinemaQuestion,
    submitAnswer,
    getCorrectAnswer
};
