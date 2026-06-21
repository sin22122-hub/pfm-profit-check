import React from 'react';

export default function HomePage({ onStart }) {
  return (
    <main className="premium-home">
      <section className="premium-hero">
        <div className="premium-hero-copy">
          <p className="eyebrow">Profit Flow Management</p>
          <h1>
            你的店真的有賺錢嗎？
            <span>美業獲利健檢™</span>
          </h1>
          <p className="lead">
            透過獲利、成本、客戶經營與數位能力四大面向，
            快速找出影響營收與成長的關鍵問題。
          </p>

          <div className="premium-icons">
            <span>專業診斷</span>
            <span>數據分析</span>
            <span>精準建議</span>
            <span>成長路徑</span>
          </div>

          <button className="btn premium-main-btn" onClick={onStart}>
            立即開始免費健檢
          </button>

          <p className="micro">
            適用美容、美甲、美睫、美髮、紋繡、SPA與個人工作室
          </p>
        </div>

        <div className="premium-report-card">
          <div className="report-cover-mark">PFM</div>
          <p>專屬經營診斷報告</p>
          <h2>美業獲利健檢報告</h2>

          <div className="report-score">
            <span>綜合分數</span>
            <strong>72</strong>
            <small>/100</small>
          </div>

          <div className="report-meta">
            <span>三大問題</span>
            <span>三大優勢</span>
            <span>成長階段</span>
            <span>成長機會</span>
          </div>
        </div>
      </section>

      <section className="premium-preview">
        <div className="section-title-line">
          <span></span>
          <h2>診斷預覽</h2>
          <span></span>
        </div>

        <div className="premium-feature-grid">
          <div>
            <strong>三大問題</strong>
            <p>找出影響獲利的關鍵阻礙</p>
          </div>
          <div>
            <strong>三大優勢</strong>
            <p>發掘你的經營亮點</p>
          </div>
          <div>
            <strong>成長階段</strong>
            <p>了解目前所在的成長階段</p>
          </div>
          <div>
            <strong>成長機會</strong>
            <p>量化潛在成長與獲利空間</p>
          </div>
        </div>
      </section>

      <section className="premium-proof">
        <p>透過 PFM 找到你的成長突破點</p>
        <span>數據驅動決策，讓努力更有價值</span>
      </section>

      <section className="premium-final-cta">
        <h2>不要再靠感覺經營，開始用數據看懂你的店。</h2>
        <button className="btn" onClick={onStart}>
          立即開始 PFM 美業獲利健檢
        </button>
      </section>
    </main>
  );
}
