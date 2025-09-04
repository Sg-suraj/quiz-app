// src/components/DifficultySelector.jsx
import React from 'react';

const DIFFICULTIES = ['easy', 'medium', 'hard'];

function DifficultySelector({ difficulty, dispatch }) {
  return (
    <div className="difficulty-selector">
      <h4>Select Difficulty:</h4>
      <div className="difficulty-buttons">
        {DIFFICULTIES.map((level) => (
          <button
            key={level}
            className={`btn btn-difficulty ${difficulty === level ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'setDifficulty', payload: level })}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DifficultySelector;