const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth');

const test = (req, res) => {
    res.json('test is working');
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Vérifier si le nom a été saisi
        if (!name) {
            return res.json({
                error: 'Le nom est requis'
            });
        }
        // Vérifier le mot de passe
        if (!password || password.length < 6) {
            return res.json({
                error: 'Le mot de passe est requis et doit comporter au moins 6 caractères'
            });
        }
        // Vérifier l'email
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                error: "L'email est déjà utilisé"
            });
        }

        const hashedPassword = await hashPassword(password);

        // Créer l'utilisateur dans la base de données
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

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: 'Aucun utilisateur trouvé'
            });
        }

        // Vérifier si le mot de passe correspond
        const match = await comparePassword(password, user.password)
        if (match) {
            // Générer le jeton JWT
            jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                // Envoyer le jeton JWT sous forme de cookie
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
    const token = req.headers.authorization.split(' ')[1]; // Récupérer le token JWT depuis l'en-tête Authorization
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Vérifier et décoder le token JWT
        const userId = decodedToken.id;
        const user = await User.findById(userId); // Rechercher l'utilisateur dans la base de données en utilisant l'ID du token
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user); // Envoyer les informations de l'utilisateur en tant que réponse
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

        // Mettre à jour le score de l'utilisateur
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
        const token = req.headers.authorization.split(' ')[1]; // Récupérer le token JWT depuis l'en-tête Authorization
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Vérifier et décoder le token JWT
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

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    getUser,
    updateUserScore,
    getUserRanking
};
