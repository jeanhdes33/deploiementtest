import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Sports', icon: '🏀', disabled: false },
  { name: 'Cinema', icon: '🎬', disabled: true },
  { name: 'Histoire', icon: '📜', disabled: true },
  { name: 'Sciences', icon: '🔬', disabled: true },
  { name: 'Arts', icon: '🎨', disabled: true },
  { name: 'Culture Générale', icon: '🌍', disabled: true },
];

const Quiz = () => {
  const [hovered, setHovered] = useState(null);

  const scaleVariants = {
    hover: {
      scale: 1.01,
      transition: {
        duration: 0.2
      }
    },
    initial: {
      scale: 1,
    },
  };

  return (
    <div className="grid-container" style={{ backgroundColor: 'white', marginTop: '20px', padding: '20px' }}>
      {categories.map((category, index) => (
        <motion.div
          key={index}
          className="grid-item bg-accent"
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          whileHover={category.disabled ? null : "hover"}
          animate={hovered === index && !category.disabled ? 'hover' : 'initial'}
          variants={scaleVariants}
          style={{ 
            backgroundColor: category.disabled ? '#D3D3D3' : (hovered === index ? '#67C6E3' : '#DFF5FF'), 
            border: 'none', 
            textAlign: 'center',
            pointerEvents: category.disabled ? 'none' : 'auto' // Désactive les événements de pointage si la catégorie est désactivée
          }}
        >
          <Link to={`/categories/${category.name.toLowerCase()}`} className="no-underline text-black">
            <span role="img" aria-label={category.name} style={{ fontSize: '40px', display: 'inline-block' }}>{category.icon}</span>
            <div className="category-info" style={{ display: 'inline-block', marginLeft: '10px' }}>
              <span className="category-name">{category.name}</span>
              {category.disabled && (
                <p style={{ margin: '5px auto 0', color: '#333', fontSize: '14px', textAlign: 'center' }}>Bientôt !</p>
              )}
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default Quiz;
