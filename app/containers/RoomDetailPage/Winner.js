// src/Winner.js
import React from 'react';
import './Winner.css'; // Ensure you create a corresponding CSS file for styling

const Winner = ({ winner }) => {
  return (
    <div className="winner-container">
      <h1>Congratulations!</h1>
      <div className="winner-card">
        <img
          src={winner.image}
          alt={`${winner.name} avatar`}
          className="winner-image"
        />
        <div className="winner-info">
          <h2>{winner.name}</h2>
          <p>{`HP: ${winner.hp}`}</p>
        </div>
      </div>
    </div>
  );
};

export default Winner;
