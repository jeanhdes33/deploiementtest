import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginTest from './components/loginTest';
import Register from './components/Register';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Sports from './components/Categories/Sports';
import Football from './components/Categories/Sports/Football';
import Dashboard from './components/Dashboard';
import QuestionForm from './components/QuestionForm'; // Importation du composant QuestionForm
import './App.css';
import logo from './logo.png';

function App() {
  // Initialiser l'état isLoggedIn en fonction de la présence des données utilisateur dans le localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('user') ? true : false;
  });

  // Fonction pour gérer la déconnexion de l'utilisateur
  const handleLogout = () => {
    localStorage.removeItem('user'); // Supprimer les données utilisateur du localStorage
    setIsLoggedIn(false); // Mettre à jour l'état pour indiquer que l'utilisateur est déconnecté
  };

  return (
    <Router>
      <div className='font-varela bg-white text-black h-screen flex flex-col'>
        <header className="bg-primary py-4 px-6 flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-8 mr-4" />
          </div>
          <div className="flex justify-center flex-grow">
            <ul className="nav-bar flex gap-4 list-none">
              <li className="text-center">
                <Link to="/" className="text-accent font-bold text-xl hover:text-tertiary no-underline">Home</Link>
              </li>
              <li className="text-center">
                <Link to="/quiz" className="text-accent font-bold text-xl hover:text-tertiary no-underline">Quiz</Link>
              </li>
              {isLoggedIn && (
                <li className="text-center">
                  <Link to="/quoizer" className="text-accent font-bold text-xl hover:text-tertiary no-underline">Quoizer</Link>
                </li>
              )}
            </ul>
          </div>
          <div className="flex items-center">
            <ul className="nav-bar flex gap-4 list-none">
              {isLoggedIn ? (
                <>
                  <li className="mr-4">
                    <Link to="/login" className="text-primary font-bold text-xl rounded-full bg-white px-6 py-3 hover:bg-tertiary transition duration-200 inline-block">
                      Mon compte
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-white font-bold text-xl rounded-full bg-red-600 px-6 py-3 hover:bg-red-700 transition duration-200 inline-block">
                      Déconnexion
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" className="text-primary font-bold text-xl rounded-full bg-white px-6 py-3 hover:bg-tertiary transition duration-200 inline-block">
                    Login
                  </Link>
                </li>
              )}
              {!isLoggedIn && (
                <li>
                  <Link to="/register" className="text-accent font-bold text-xl rounded-full bg-secondary px-6 py-3 hover:bg-tertiary transition duration-200 inline-block">
                    Register
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </header>
        <main className="flex-grow flex justify-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginTest setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
            <Route path="/register" element={<Register />} />
            {isLoggedIn && (
              <Route path="/quiz" element={<Quiz />} />
            )}
            <Route path="/categories/sports" element={<Sports />} />
            <Route path="/categories/football" element={<Football />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {!isLoggedIn && (
              <Route path="/quiz" element={<Navigate to="/login" />} />
            )}
            <Route path="/quoizer" element={<QuestionForm />} /> {/* Utilisation du composant QuestionForm pour la route /quoizer */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}



export default App;
