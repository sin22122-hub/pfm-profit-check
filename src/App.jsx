import React, { useState } from 'react';

import HomePage from './components/HomePage.jsx';
import AssessmentForm from './components/AssessmentForm.jsx';
import ResultDashboard from './components/ResultDashboard.jsx';

import { questions } from './data/questions.js';
import { submitToGoogleForm } from './utils/googleFormApi.js';
import { fetchDashboardData } from './utils/sheetApi.js';

export default function App() {
  const [view, setView] = useState('home');
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startAssessment = () => {
    setView('form');
    setResult(null);
    setFormData({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateRequiredFields = (data) => {
    const requiredFields = [
      'storeName',
      'contactName',
      'phone',
      'instagram',
      'businessType',
      'storeType',
      'month',
      'serviceRevenue',
      'totalCustomers',
      'newCustomers',
      'returningCustomers',
    ];

    return requiredFields.filter((key) => {
      const value = data[key];

      if (Array.isArray(value)) {
        return value.length === 0;
      }

      return value === undefined || value === null || String(value).trim() === '';
    });
  };

  const handleSubmit = async (data) => {
    const missingFields = validateRequiredFields(data);

    if (missingFields.length > 0) {
      alert('請先完成必要欄位後，再產生健檢結果。');
      return;
    }

    try {
      setIsSubmitting(true);

      const submitResult = await submitToGoogleForm(data);

      await new Promise((resolve) => setTimeout(resolve, 1800));

      const sheetResult = await fetchDashboardData(submitResult.submissionId);

      if (!sheetResult || !sheetResult.totalRevenue) {
        alert('目前沒有取得有效健檢結果，請確認資料是否完整。');
        return;
      }

      setFormData({
        ...data,
        submissionId: submitResult.submissionId,
      });

      setResult(sheetResult);
      setView('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('PFM submit/read failed:', error);
      alert('資料送出或讀取結果失敗，請稍後再試。');
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
