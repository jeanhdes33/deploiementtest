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
  const [score, setScore] = useState(0); // Nouveau state pour stocker le score

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const userScore = localStorage.getItem('score'); // Récupérer le score du local storage
    if (loggedInUser && token) {
      const userData = JSON.parse(loggedInUser);
      setUsername(userData.name);
      setJwt(token);
      setIsLoggedIn(true);
      if (userScore) {
        setScore(parseInt(userScore)); // Mettre à jour le score avec celui du local storage
      }
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
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setErrorMessage('Erreur lors de la connexion');
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

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12 font-varela">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">{isLoggedIn ? 'Mon compte' : 'Login'}</h2> {/* Changer le titre en fonction de l'état isLoggedIn */}

        {isLoggedIn ? (
          <div className="text-center">
            <p className="mb-4 text-xl">Bienvenue, {username}!</p>
            <p className="mb-2">Votre score actuel : {score}</p> {/* Afficher le score */}
            <p className="text-sm text-gray-500">Vous êtes connecté avec succès.</p>
          </div>
        ) : (
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

        {errorMessage && (
          <div className="flex items-center justify-center bg-gray-100 p-4 mt-4">
            <p className="text-center text-sm text-red-500">{errorMessage}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default LoginTest;
