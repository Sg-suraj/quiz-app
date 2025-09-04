import { createContext, useContext, useEffect, useReducer } from 'react';

const QuizContext = createContext();

const initialState = {
  questions: [],
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
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
      // ... (This part is unchanged)
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
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
      // UPDATED: Now resets the entire state, including questions, back to the beginning
      // This will trigger the useEffect to fetch new questions
      return { ...initialState, status: 'loading' };
    
    default:
      throw new Error('Action unknown');
  }
}

function QuizProvider({ children }) {
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  // UPDATED: This useEffect now runs whenever the 'status' changes to 'loading'
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
  }, [status]); // Dependency array now includes 'status'

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
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