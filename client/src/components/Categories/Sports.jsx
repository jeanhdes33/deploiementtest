import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Sport = () => {
  const sportCategories = [
    { name: 'Football', icon: '⚽', description: 'Description du football.', slug: 'football' },
    { name: 'Basketball', icon: '🏀', description: 'Description du basketball.', slug: 'basketball', disabled: true }, // Ajouter la propriété disabled
    { name: 'Tennis', icon: '🎾', description: 'Description du tennis.', slug: 'tennis', disabled: true }, // Ajouter la propriété disabled
  ];

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Choisissez votre catégorie</h1>
      <div className="grid-container" style={{ backgroundColor: 'white', padding: '20px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
        {sportCategories.map((category, index) => (
          <motion.div
            key={index}
            className="grid-item bg-accent"
            style={{ 
              backgroundColor: category.disabled ? '#D3D3D3' : '#DFF5FF', // Changer la couleur en gris si la catégorie est désactivée
              border: 'none', 
              marginBottom: '20px', 
              textAlign: 'center', 
              padding: '10px', 
              width: '300px',
              pointerEvents: category.disabled ? 'none' : 'auto' // Désactiver les événements de pointage si la catégorie est désactivée
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Link to={`/categories/${category.slug}`} className="no-underline text-black">
              <span role="img" aria-label={category.name} style={{ fontSize: '40px' }}>{category.icon}</span>
              <div className="category-info">
                <span className="category-name">{category.name}</span>
                <div className="category-description bg-tertiary px-4 py-2 rounded-md opacity-0 hidden">
                  {category.description}
                </div>
              </div>
            </Link>
            {category.disabled && (
              <p style={{ margin: '5px auto 0', color: '#333', fontSize: '14px', textAlign: 'center' }}>Bientôt !</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Sport;
