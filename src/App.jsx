// src/App.jsx
import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useQuiz } from './contexts/QuizContext';

// Import the new page components
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';

import './assets/styles/App.css';

function App() {
  const { status } = useQuiz();
  const navigate = useNavigate();

  // This effect handles navigation when the quiz status changes
  useEffect(() => {
    if (status === 'active' && window.location.pathname !== '/quiz') navigate('/quiz');
    if (status === 'finished' && window.location.pathname !== '/results') navigate('/results');
    // On restart or initial load, go to the start screen
    if (status === 'ready' || status === 'loading') navigate('/');
  }, [status, navigate]);

  return (
    <div className="app">
      <header>
        <h1>The React Quiz</h1>
      </header>
      <main>
        {status === 'loading' && <p>Loading questions...</p>}
        {status === 'error' && <p>Error fetching questions.</p>}
        
        {/* The Routes component replaces the old if/else logic */}
        {(status === 'ready' || status === 'active' || status === 'finished') && (
          <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route path="/quiz" element={<QuizScreen />} />
            <Route path="/results" element={<ResultsScreen />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;