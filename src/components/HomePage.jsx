import React from 'react';

export default function HomePage({ onStart }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Profit Flow Management</p>
          <h1>你的店真的有賺錢嗎？</h1>
          <p className="lead">
            透過獲利、成本、客戶經營與數位能力四大面向，
            快速找出影響營收與成長的關鍵問題。
          </p>
          <button className="btn" onClick={onStart}>立即開始免費健檢</button>
          <p className="micro">適用美容、美甲、美睫、美髮、紋繡、SPA與個人工作室</p>
        </div>

        <div className="mock-card">
          <p className="eyebrow">診斷預覽</p>
          <h2>三大問題｜三大優勢｜成長階段｜成長機會</h2>
          <div className="mock-list">
            <span>① 回流率偏低</span>
            <span>② 客戶經營力不足</span>
            <span>③ 淨利率偏低</span>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>明明每天都很忙，為什麼帳戶裡還是沒有錢？</h2>
        <div className="pain-grid">
          <div>營收看起來不錯，但月底沒有留下多少利潤。</div>
          <div>客人一直來，卻總是留不住。</div>
          <div>社群每天更新，業績卻沒有明顯成長。</div>
          <div>不知道問題出在哪，只能不斷更努力工作。</div>
        </div>
      </section>

      <section className="section">
        <h2>完成健檢後，你將立即獲得</h2>
        <div className="feature-grid">
          {[
            '獲利健康度分析',
            '三大經營問題',
            '三大經營優勢',
            '店家成長階段',
            '成長機會分析',
            '改善優先順序'
          ].map((item) => (
            <div className="feature-card" key={item}>{item}</div>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <h2>不要再靠感覺經營，開始用數據看懂你的店。</h2>
        <button className="btn" onClick={onStart}>立即開始 PFM 美業獲利健檢</button>
      </section>
    </main>
  );
}
