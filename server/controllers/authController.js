const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth');

const test = (req, res) => {
    res.json('test is working');
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name) {
            return res.json({
                error: 'Le nom est requis'
            });
        }
        if (!password || password.length < 6) {
            return res.json({
                error: 'Le mot de passe est requis et doit comporter au moins 6 caractères'
            });
        }
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                error: "L'email est déjà utilisé"
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: 'Aucun utilisateur trouvé'
            });
        }

        const match = await comparePassword(password, user.password)
        if (match) {
            jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token, { httpOnly: true }).json({ token });
            });
        } else {
            res.json({
                error: "Les mots de passe ne correspondent pas"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erreur lors de la connexion de l\'utilisateur' });
    }
};

const getProfile = (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err;
            res.json(user);
        });

    } else {
        res.json(null);
    }
};

const getUser = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateUserScore = async (req, res) => {
    const { userId, newScore } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        user.score = newScore;
        await user.save();

        res.status(200).json({ message: 'Score mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du score de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du score de l\'utilisateur' });
    }
};

const getUserRanking = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;
        
        const users = await User.find().sort({ score: -1 });
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        
        const userRank = users.findIndex(u => u._id.toString() === user._id.toString()) + 1;
        res.json({ ranking: userRank, totalUsers: users.length });
    } catch (error) {
        console.error('Erreur lors de la récupération du classement de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du classement de l\'utilisateur' });
    }
};

const getBestScore = async (req, res) => {
    try {
        const users = await User.find().sort({ score: -1 }).limit(1);
        if (users.length > 0) {
            res.json({ bestScore: users[0].score });
        } else {
            res.json({ bestScore: 0 });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du meilleur score :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du meilleur score' });
    }
};

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    getUser,
    updateUserScore,
    getUserRanking,
    getBestScore
};
