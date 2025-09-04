// src/components/QuestionCard.jsx

import { useQuiz } from "../contexts/QuizContext";

function QuestionCard({ question }) {
  const { dispatch, answer } = useQuiz();

  const isAnswered = answer !== null;

  return (
    <div className="question-card">
      <h4>{question.question}</h4>
      <div className="options">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctOption;
          const isSelected = index === answer;

          // Determine button class
          let btnClass = 'btn';
          if (isAnswered) {
            if (isCorrect) btnClass += ' correct';
            else if (isSelected) btnClass += ' wrong';
          }

          return (
            <button
              key={option}
              className={btnClass}
              onClick={() => dispatch({ type: 'newAnswer', payload: index })}
              disabled={isAnswered}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionCard;