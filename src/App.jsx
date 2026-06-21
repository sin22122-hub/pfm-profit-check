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

      await new Promise((resolve) => setTimeout(resolve, 3500));

      const sheetResult = await fetchDashboardData(submitResult.submissionId);

      if (!sheetResult || !sheetResult.totalRevenue) {
        alert(`請先完成以下必要欄位：\n\n${missingFields.join('\n')}`);
console.log('PFM missingFields:', missingFields);
console.log('PFM submitted data:', data);
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
     alert(`資料送出或讀取結果失敗：\n${error.message}`);
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

   {view === 'form' && !isSubmitting && (
  <AssessmentForm
    questions={questions}
    onSubmit={handleSubmit}
    isSubmitting={isSubmitting}
  />
)}

{view === 'form' && isSubmitting && (
  <main className="pfm-loading-page">
    <div className="pfm-loading-card">
      <div className="pfm-loading-mark">PFM</div>
      <p className="pfm-eyebrow">產生診斷報告中</p>
      <h1>正在整理你的店家獲利狀態</h1>
      <div className="pfm-loading-steps">
        <span>分析獲利結構</span>
        <span>計算經營指標</span>
        <span>產生成長藍圖</span>
      </div>
    </div>
  </main>
  
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
