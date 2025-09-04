// src/App.jsx

// ADDED: Import the new component
import DifficultySelector from './components/DifficultySelector';
import ResultsSummary from './components/ResultsSummary';
import { useQuiz } from './contexts/QuizContext';
import QuestionCard from './components/QuestionCard';
import './assets/styles/App.css';

function App() {
  // UPDATED: Destructure 'difficulty' from the context
  const { status, index, questions, answer, answers, dispatch, points, highscore, maxPossiblePoints, difficulty } = useQuiz();

  const numQuestions = questions.length;
  const currentQuestion = questions[index];

  return (
    <div className="app">
      <header>
        <h1>The React Quiz</h1>
      </header>

      <main>
        {status === 'loading' && <p>Loading questions...</p>}
        {status === 'error' && <p>Error fetching questions.</p>}
        {status === 'ready' && (
          <>
            <h2>Welcome to The React Quiz!</h2>
            <h3>{numQuestions} questions to test your React mastery.</h3>
            
            {/* ADDED: The new difficulty selector component */}
            <DifficultySelector difficulty={difficulty} dispatch={dispatch} />

            <button
              className="btn"
              onClick={() => dispatch({ type: 'start' })}
            >
              Let's start
            </button>
          </>
        )}
        {status === 'active' && (
          <>
            <p>
              Question {index + 1} / {numQuestions}
            </p>
            <QuestionCard
              question={currentQuestion}
            />
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
        )}
        {status === 'finished' && (
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
        )}
      </main>
    </div>
  );
}

export default App;
