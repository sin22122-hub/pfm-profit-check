import React, { useState } from 'react';

import HomePage from './components/HomePage.jsx';
import AssessmentForm from './components/AssessmentForm.jsx';
import ResultDashboard from './components/ResultDashboard.jsx';

import { questions } from './data/questions.js';
import { calculateDiagnosis } from './utils/calculations.js';
import { submitToGoogleForm } from './utils/googleFormApi.js';

export default function App() {
  const [view, setView] = useState('home');
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startAssessment = () => {
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      await submitToGoogleForm(data);

      setFormData(data);
      setResult(calculateDiagnosis(data));
      setView('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Google Form submit failed:', error);
      alert('資料送出失敗，請稍後再試。');
    } finally {
      setIsSubmitting(false);
    }
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
        <button className="btn small" onClick={startAssessment}>
          開始健檢
        </button>
      </header>

      {view === 'home' && <HomePage onStart={startAssessment} />}
      {view === 'form' && (
        <AssessmentForm
          questions={questions}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
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
