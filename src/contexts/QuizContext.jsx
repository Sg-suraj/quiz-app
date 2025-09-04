import { createContext, useContext, useEffect, useReducer } from 'react';

const QuizContext = createContext();

const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  answers: [],
  points: 0,
  // UPDATED: Reads highscore from localStorage
  highscore: Number(localStorage.getItem('highscore')) || 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      // ... (This part is unchanged)
      if (!action.payload || !Array.isArray(action.payload)) {
        return { ...state, status: 'error' };
      }
      const formattedQuestions = action.payload.map((q) => {
        const options = [...q.incorrectAnswers, q.correctAnswer].sort(
          () => Math.random() - 0.5
        );
        const correctOption = options.indexOf(q.correctAnswer);
        
        return {
          question: q.question.text,
          options: options,
          correctOption: correctOption,
          points: 10,
        };
      });
      return { ...state, questions: formattedQuestions, status: 'ready' };
    
    case 'dataFailed':
      return { ...state, status: 'error' };
    
    case 'start':
      return { ...state, status: 'active' };
    
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
    
    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null };
    
    case 'finish':
      return { ...state, status: 'finished' };
    
    case 'restart':
      return { ...initialState, questions: state.questions, status: 'loading' };

    // ADDED: New case to handle updating the highscore in the state
    case 'updateHighscore':
      return { ...state, highscore: action.payload };

    default:
      throw new Error('Action unknown');
  }
}

function QuizProvider({ children }) {
  // UPDATED: Destructure 'highscore' and 'answers' from the state
  const [{ questions, status, index, answer, answers, points, highscore }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );
  
  // ADDED: useEffect to save the highscore when the quiz is finished
  useEffect(() => {
    if (status === 'finished' && points > highscore) {
      localStorage.setItem('highscore', String(points));
      dispatch({ type: 'updateHighscore', payload: points });
    }
  }, [status, points, highscore]);

  // useEffect for fetching questions (unchanged)
  useEffect(function () {
    if (status !== 'loading') return;

    fetch(`https://the-trivia-api.com/v2/questions?cache=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          dispatch({ type: 'dataReceived', payload: data });
        } else {
          dispatch({ type: 'dataFailed' });
        }
      })
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, [status]);

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        answers,
        points,
        highscore, // UPDATED: Provide highscore to the app
        numQuestions,
        maxPossiblePoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error('QuizContext was used outside of the QuizProvider');
  return context;
}

export { QuizProvider, useQuiz };
