import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function LoginTest({ setIsLoggedIn, isLoggedIn }) {
    const [data, setData] = useState({
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [errorVisible, setErrorVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [jwt, setJwt] = useState('');
    const [score, setScore] = useState(() => {
        const userScore = localStorage.getItem('score');
        return userScore ? parseInt(userScore) : 0;
    });
    const [userRanking, setUserRanking] = useState(null);
    const [totalUsers, setTotalUsers] = useState(null);
    const [bestScore, setBestScore] = useState(null);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (loggedInUser && token) {
            const userData = JSON.parse(loggedInUser);
            setUsername(userData.name);
            setJwt(token);
            setIsLoggedIn(true);
            fetchUserRanking(token);
            fetchBestScore();
        }
    }, [setIsLoggedIn]);

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/login', {
                email: data.email,
                password: data.password
            });
            if (response.data.error) {
                setErrorMessage(response.data.error);
                setErrorVisible(true);
                setTimeout(() => {
                    setErrorMessage('');
                    setErrorVisible(false);
                }, 1000);
            } else {
                const userData = response.data;
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('token', response.data.token);
                setUsername(userData.name);
                setJwt(response.data.token);
                setIsLoggedIn(true);
                setData({ email: '', password: '' });
                fetchScore(response.data.token);
                fetchUserRanking(response.data.token);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            setErrorMessage('Erreur lors de la connexion');
            setErrorVisible(true);
            setTimeout(() => {
                setErrorMessage('');
                setErrorVisible(false);
            }, 1000);
        }
    };

    const fetchScore = async (token) => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const userScore = response.data.score;
            setScore(userScore);
            localStorage.setItem('score', userScore.toString());
        } catch (error) {
            console.error('Erreur lors de la récupération du score:', error);
        }
    };

    const fetchUserRanking = async (token) => {
        try {
            const response = await axios.get('http://localhost:8000/user-ranking', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserRanking(response.data.ranking);
            setTotalUsers(response.data.totalUsers);
        } catch (error) {
            console.error('Erreur lors de la récupération du classement de l\'utilisateur:', error);
        }
    };

    const fetchBestScore = async () => {
        try {
            const response = await axios.get('http://localhost:8000/best-score');
            setBestScore(response.data.bestScore);
        } catch (error) {
            console.error('Erreur lors de la récupération du meilleur score:', error);
        }
    };

    const shareOnTwitter = () => {
        const shareUrl = `https://twitter.com/intent/tweet?text=Mon%20score%20total%20est%20de%20${score}%20et%20mon%20classement%20est%20${userRanking}%2F${totalUsers}%20sur%20Quoiz%20!%20Viens%20me%20battre%20!`;
        window.open(shareUrl, '_blank');
    };

    const shareOnFacebook = () => {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=https://example.com&quote=Mon%20score%20total%20est%20de%20${score}%20et%20mon%20classement%20est%20${userRanking}%2F${totalUsers}%20sur%20Quoiz%20!%20Viens%20me%20battre%20!`;
        window.open(shareUrl, '_blank');
    };

    return (
        <div className="min-h-screen flex flex-col justify-start items-center py-12">
            {!isLoggedIn && (
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Connexion</h1>
            )}

            {isLoggedIn && (
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                    <div className="text-center mb-8">
                        <p className="text-3xl font-bold text-gray-800 mb-4">Bienvenue, {username}!</p>
                        <p className="text-xl mb-6">Votre score actuel : {score}</p>
                        <p className="text-xl mb-4">Votre classement : {userRanking} / {totalUsers} utilisateurs</p>
                        <p className="text-xl mb-4">Meilleur score à battre : {bestScore}</p>
                        <p className="text-lg text-gray-500 mb-4">Vous êtes connecté avec succès.</p>
                    </div>

                    <div className="flex flex-row justify-center">
                        <button onClick={shareOnTwitter} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-4">Partager sur Twitter</button>
                        <button onClick={shareOnFacebook} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Partager sur Facebook</button>
                    </div>
                </div>
            )}

            {!isLoggedIn && (
                <form className="mx-auto max-w-lg rounded-lg border" onSubmit={loginUser}>
                    <div className="flex flex-col gap-4 p-4 md:p-8 bg-accent">
                        <div>
                            <label htmlFor="email" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
                            />
                        </div>

                        <button type="submit" className="block rounded-lg bg-secondary px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-primary focus-visible:ring active:bg-gray-600 md:text-base">Log in</button>
                    </div>

                    <div className="flex items-center justify-center bg-gray-100 p-4">
                        <p className="text-center text-sm text-gray-500">Vous n'avez pas de compte ? <Link to="/register" className="text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">Register</Link></p>
                    </div>
                </form>
            )}

            {errorVisible && errorMessage && (
                <div className="flex items-center justify-center bg-gray-100 p-4 mt-4">
                    <p className="text-center text-sm text-red-500">{errorMessage}</p>
                </div>
            )}
        </div>
    );
}

export default LoginTest;
