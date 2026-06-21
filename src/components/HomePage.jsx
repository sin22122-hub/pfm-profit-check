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
            <span className="icon-card">專業診斷</span>
            <span className="icon-bars">數據分析</span>
            <span className="icon-target">精準建議</span>
            <span className="icon-growth">成長路徑</span>
          </div>

          <button className="btn premium-main-btn" onClick={onStart}>
            立即開始免費健檢
          </button>

          <p className="micro">
            適用：美容、美甲、美睫、美髮、紋繡、SPA等項目之工作室、小型店面與連鎖經營。
          </p>
        </div>

        <div className="premium-book-stage">
          <div className="premium-book">
            <div className="book-glow" />
            <div className="book-logo">PFM</div>
            <div className="book-sub">Profit Flow Management</div>
            <h2>美業獲利健檢報告</h2>

            <div className="book-radar">
              <div className="radar-line" />
              <span>獲利能力</span>
              <span>經營效率</span>
              <span>客戶經營</span>
              <span>數位成長</span>
            </div>

            <div className="book-score">
              <small>綜合分數</small>
              <strong>72</strong>
              <em>/100</em>
            </div>

            <p>專屬經營診斷報告</p>
          </div>
        </div>
      </section>

      <section className="premium-pain-section">
        <h2>明明每天都很忙，為什麼帳戶裡還是沒有錢？</h2>

        <div className="premium-pain-grid">
          <div><i>●</i><p>營收看起來不錯，<strong>但月底沒有留下多少利潤。</strong></p></div>
          <div><i>●</i><p>客人一直來，<strong>卻總是留不住。</strong></p></div>
          <div><i>●</i><p>社群每天更新，<strong>業績卻沒有明顯成長。</strong></p></div>
          <div><i>●</i><p>不知道問題出在哪，<strong>只能不斷更努力工作。</strong></p></div>
        </div>
      </section>

      <section className="premium-preview">
        <div className="section-title-line">
          <span />
          <h2>診斷預覽</h2>
          <span />
        </div>

        <div className="premium-feature-grid">
          <div><i className="preview-icon search" /><strong>三大問題</strong><p>找出影響獲利的關鍵阻礙</p></div>
          <div><i className="preview-icon diamond" /><strong>三大優勢</strong><p>發掘你的經營亮點</p></div>
          <div><i className="preview-icon radar" /><strong>成長階段</strong><p>了解目前所在的成長階段</p></div>
          <div><i className="preview-icon chart" /><strong>成長機會</strong><p>量化潛在成長與獲利空間</p></div>
        </div>
      </section>

      <section className="premium-proof">
        <p>透過 PFM 找到你的成長突破點</p>
        <span>數據驅動決策，讓努力更有價值</span>
      </section>
    </main>
  );
}
