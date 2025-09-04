// src/components/ResultsScreen.jsx
import React from 'react';
import { useQuiz } from '../contexts/QuizContext';
import ResultsSummary from './ResultsSummary';

function ResultsScreen() {
  const { points, maxPossiblePoints, highscore, dispatch, questions, answers } = useQuiz();

  return (
    <>
      <h2>Quiz Finished!</h2>
      <p>
        You scored <strong>{points}</strong> out of{' '}
        {maxPossiblePoints} points.
      </p>
      <p className="highscore">(High Score: {highscore} points)</p>
      <button
        className="btn"
        onClick={() => dispatch({ type: 'restart' })}
      >
        Restart Quiz
      </button>
      <ResultsSummary questions={questions} answers={answers} />
    </>
  );
}

export default ResultsScreen;