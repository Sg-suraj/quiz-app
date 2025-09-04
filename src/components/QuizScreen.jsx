// src/components/QuizScreen.jsx
import React from 'react';
import { useQuiz } from '../contexts/QuizContext';
import QuestionCard from './QuestionCard';

function QuizScreen() {
  const { index, numQuestions, currentQuestion, answer, dispatch } = useQuiz();

  return (
    <>
      <p>
        Question {index + 1} / {numQuestions}
      </p>
      <QuestionCard question={currentQuestion} />
      {answer !== null && (
        <button
          className="btn"
          onClick={() =>
            index < numQuestions - 1
              ? dispatch({ type: 'nextQuestion' })
              : dispatch({ type: 'finish' })
          }
        >
          {index < numQuestions - 1 ? 'Next' : 'Finish'}
        </button>
      )}
    </>
  );
}

export default QuizScreen;