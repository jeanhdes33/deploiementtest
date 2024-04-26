import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function LoginTest({ setIsLoggedIn, isLoggedIn }) {
  const [data, setData] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState('');
  const [jwt, setJwt] = useState('');
  const [score, setScore] = useState(() => {
    const userScore = localStorage.getItem('score');
    return userScore ? parseInt(userScore) : 0;
  });

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (loggedInUser && token) {
      const userData = JSON.parse(loggedInUser);
      setUsername(userData.name);
      setJwt(token);
      setIsLoggedIn(true);
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
      } else {
        const userData = response.data;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
        setUsername(userData.name);
        setJwt(response.data.token);
        setIsLoggedIn(true);
        setData({ email: '', password: '' });
        fetchScore(response.data.token); // Call fetchScore after successful login
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setErrorMessage('Erreur lors de la connexion');
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

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/user', {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      setUsername(response.data.name);
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
    }
  };

  useEffect(() => {
    if (jwt) {
      fetchUserData();
    }
  }, [jwt]);

  // Fonction pour partager sur Twitter
  const shareOnTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=Mon%20score%20sur%20Quoiz%20est%20de%20${score}%20!%20🎉`;
    window.open(shareUrl, '_blank');
  };

  // Fonction pour partager sur Facebook
  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=https://example.com&quote=Mon%20score%20sur%20Quoiz%20est%20de%20${score}%20!%20🎉`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col justify-start items-center py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {isLoggedIn && (
          <div className="text-center mb-8">
            <p className="text-3xl font-bold text-gray-800 mb-4">Bienvenue, {username}!</p>
            <p className="text-xl mb-6">Votre score actuel : {score}</p>
            <p className="text-lg text-gray-500 mb-4">Vous êtes connecté avec succès.</p>
          </div>
        )}

        {!isLoggedIn && (
          <form onSubmit={loginUser} className="flex flex-col">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="mt-1 block w-full shadow-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  className="mt-1 block w-full shadow-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Log in
              </button>
            </div>
          </form>
        )}

        {errorMessage && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        {!isLoggedIn && (
          <div className="mt-4 text-sm text-gray-600">
            Vous n'avez pas de compte ? <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Register</Link>
          </div>
        )}

        {/* Boutons de partage */}
        {isLoggedIn && (
          <div className="flex flex-row justify-center">
            <button onClick={shareOnTwitter} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-4">Partager sur Twitter</button>
            <button onClick={shareOnFacebook} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Partager sur Facebook</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginTest;
