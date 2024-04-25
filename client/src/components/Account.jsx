import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Account() {
  const [userName, setUserName] = useState('');
  const [jwtToken, setJwtToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Récupérer le JWT depuis le localStorage avec la clé 'token'
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setJwtToken(storedToken);
      // Récupérer les informations de l'utilisateur à partir du serveur en utilisant le token JWT
      axios.get('http://localhost:8000/profile', {
        headers: {
          Authorization: `Bearer ${storedToken}` // Ajouter le token JWT dans l'en-tête de la requête
        }
      })
      .then(response => {
        const userData = response.data;
        setUserName(userData.name);
        setLoading(false);
      })
      .catch(error => {
        setError('Une erreur s\'est produite lors de la récupération des informations de l\'utilisateur.');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div>
      {loading ? (
        <p>Chargement des informations de l'utilisateur...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h2>Bienvenue, {userName} !</h2>
          <p>JWT : {jwtToken}</p>
          {/* Afficher d'autres informations si nécessaire */}
        </div>
      )}
    </div>
  );
}

export default Account;
