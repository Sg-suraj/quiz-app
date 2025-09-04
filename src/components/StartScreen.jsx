// src/components/StartScreen.jsx
import React from 'react';
import { useQuiz } from '../contexts/QuizContext';
import DifficultySelector from './DifficultySelector';

function StartScreen() {
  const { numQuestions, difficulty, dispatch } = useQuiz();

  return (
    <>
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery.</h3>
      <DifficultySelector difficulty={difficulty} dispatch={dispatch} />
      <button
        className="btn"
        onClick={() => dispatch({ type: 'start' })}
      >
        Let's start
      </button>
    </>
  );
}

export default StartScreen;