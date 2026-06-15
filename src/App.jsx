import React, { useState } from 'react';

import HomePage from './components/HomePage.jsx';
import AssessmentForm from './components/AssessmentForm.jsx';
import ResultDashboard from './components/ResultDashboard.jsx';

import { questions } from './data/questions.js';
import { calculateDiagnosis } from './utils/calculations.js';

export default function App() {
  const [view, setView] = useState('home');
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({});

  const startAssessment = () => {
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (data) => {
    setFormData(data);
    setResult(calculateDiagnosis(data));
    setView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="site-header">
        <div className="brand">
          <div className="brand-mark">PFM</div>
          <div>
            <strong>PFM 美業獲利健檢™</strong>
            <span>Profit Flow Management</span>
          </div>
        </div>
        <button className="btn small" onClick={startAssessment}>開始健檢</button>
      </header>

      {view === 'home' && <HomePage onStart={startAssessment} />}
      {view === 'form' && <AssessmentForm questions={questions} onSubmit={handleSubmit} />}
      {view === 'result' && result && (
        <ResultDashboard
          result={result}
          formData={formData}
          onRestart={startAssessment}
        />
      )}
    </>
  );
}
