const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth');

const test = (req, res) => {
    res.json('test is working');
};

// Endpoint de registration
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
    }
};

// Endpoint de connexion
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

// Fonction pour récupérer les informations de l'utilisateur à partir du token JWT
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

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    getUser // Ajout de la fonction getUser
};
