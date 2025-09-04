// src/contexts/QuizContext.jsx

import { createContext, useContext, useEffect, useReducer } from 'react';

const QuizContext = createContext();

const initialState = {
  questions: [],
  status: 'loading', // 'loading', 'error', 'ready', 'active', 'finished'
  index: 0,
  answer: null,
  answers: [],
  points: 0,
  highscore: Number(localStorage.getItem('highscore')) || 0,
  difficulty: 'easy', // ADDED: difficulty state, defaults to 'easy'
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      // ... (This part is unchanged)
      // ...
    
    // ADDED: New case to handle changing difficulty
    case 'setDifficulty':
      return { ...state, difficulty: action.payload, status: 'loading' };

    // UPDATED: 'restart' action now preserves difficulty
    case 'restart':
      return { 
        ...initialState, 
        questions: state.questions, 
        highscore: state.highscore,
        difficulty: state.difficulty, 
        status: 'loading' 
      };

    // ... other cases are unchanged ...
    case 'dataFailed': return { ...state, status: 'error' };
    case 'start': return { ...state, status: 'active' };
    case 'newAnswer':
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        answers: [...state.answers, action.payload],
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case 'nextQuestion': return { ...state, index: state.index + 1, answer: null };
    case 'finish': return { ...state, status: 'finished' };
    case 'updateHighscore': return { ...state, highscore: action.payload };
    default: throw new Error('Action unknown');
  }
}

function QuizProvider({ children }) {
  // UPDATED: Destructure 'difficulty' from state
  const [{ questions, status, index, answer, answers, points, highscore, difficulty }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // ... (unchanged logic for numQuestions, maxPossiblePoints, highscore useEffect)

  // UPDATED: This useEffect now depends on 'difficulty' and includes it in the API call
  useEffect(function () {
    if (status !== 'loading') return;

    fetch(`https://the-trivia-api.com/v2/questions?limit=10&difficulties=${difficulty}&cache=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          dispatch({ type: 'dataReceived', payload: data });
        } else {
          dispatch({ type: 'dataFailed' });
        }
      })
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, [status, difficulty]); // Dependency array now includes 'difficulty'

  return (
    <QuizContext.Provider
      value={{
        // ... other values
        highscore,
        difficulty, // ADDED: provide difficulty to the app
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

// ... useQuiz and export are unchanged
