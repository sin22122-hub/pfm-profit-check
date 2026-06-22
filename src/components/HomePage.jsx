import React from 'react';

import diagnosisIcon from '../assets/icons/professional-diagnosis.png';
import dataIcon from '../assets/icons/data-analysis.png';
import adviceIcon from '../assets/icons/precision-advice.png';
import roadmapIcon from '../assets/icons/growth-roadmap.png';

const aspectCards = [
  {
    src: diagnosisIcon,
    alt: '獲利能力分析',
    title: '獲利能力分析',
    text: '掌握營收、毛利與淨利，判斷店裡是不是真的有留下錢。',
  },
  {
    src: dataIcon,
    alt: '客戶經營洞察',
    title: '客戶經營洞察',
    text: '看見新客、回流與介紹客狀況，找出客源穩定度。',
  },
  {
    src: adviceIcon,
    alt: '成本結構檢視',
    title: '成本結構檢視',
    text: '拆解租金、人事、材料、金流與廣告成本，找出獲利黑洞。',
  },
  {
    src: roadmapIcon,
    alt: '成長策略建議',
    title: '成長策略建議',
    text: '依照數據結果，整理出下一步最該優先改善的方向。',
  },
];

function PremiumIcon({ src, alt }) {
  return (
    <span className="pfm-premium-icon-wrap">
      <span className="pfm-premium-icon-glow" />
      <img src={src} alt={alt} className="pfm-premium-icon-img" />
    </span>
  );
}

function GoldIcon({ type }) {
  const icons = {
    coin: (
      <>
        <ellipse cx="9" cy="7" rx="5" ry="3" />
        <path d="M4 7v6c0 1.7 2.2 3 5 3s5-1.3 5-3V7" />
        <path d="M14 10c3 .25 5 1.5 5 3 0 1.7-2.2 3-5 3" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.8-4.2 14.2-4.2 16 0" />
      </>
    ),
    loop: (
      <>
        <path d="M17 3l4 4-4 4" />
        <path d="M3 11V9a5 5 0 0 1 5-5h13" />
        <path d="M7 21l-4-4 4-4" />
        <path d="M21 13v2a5 5 0 0 1-5 5H3" />
      </>
    ),
    question: (
      <>
        <path d="M9.2 9a3 3 0 1 1 5.6 1.5c-.9 1.2-2.8 1.6-2.8 3.5" />
        <path d="M12 18h.01" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-4-4" />
      </>
    ),
    diamond: (
      <>
        <path d="M6 4h12l4 6-10 11L2 10l4-6Z" />
        <path d="M2 10h20" />
        <path d="M12 21L8 10l4-6 4 6-4 11Z" />
      </>
    ),
    stage: (
      <>
        <path d="M12 3l7 4v10l-7 4-7-4V7l7-4Z" />
        <path d="M12 3v18" />
        <path d="M5 7l7 4 7-4" />
        <path d="M5 17l7-6 7 6" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 16v-4" />
        <path d="M12 16V8" />
        <path d="M16 16v-6" />
      </>
    ),
  };

  return (
    <span className="pfm-gold-badge" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icons[type]}
      </svg>
    </span>
  );
}

function Laurel() {
  return (
    <svg
      className="pfm-laurel-svg"
      viewBox="0 0 180 86"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="pfm-laurel-arc"
        d="M18 64 C48 28, 73 18, 90 18 C107 18, 132 28, 162 64"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse cx="38" cy="54" rx="9" ry="4.5" transform="rotate(-38 38 54)" fill="currentColor" />
      <ellipse cx="54" cy="41" rx="9" ry="4.5" transform="rotate(-28 54 41)" fill="currentColor" />
      <ellipse cx="73" cy="31" rx="9" ry="4.5" transform="rotate(-14 73 31)" fill="currentColor" />
      <ellipse cx="90" cy="27" rx="9" ry="4.5" fill="currentColor" />
      <ellipse cx="107" cy="31" rx="9" ry="4.5" transform="rotate(14 107 31)" fill="currentColor" />
      <ellipse cx="126" cy="41" rx="9" ry="4.5" transform="rotate(28 126 41)" fill="currentColor" />
      <ellipse cx="142" cy="54" rx="9" ry="4.5" transform="rotate(38 142 54)" fill="currentColor" />
    </svg>
  );
}

export default function HomePage({ onStart }) {
  return (
    <main className="pfm-home-luxury">
      <section className="pfm-lux-hero pfm-v72-hero">
        <div className="pfm-lux-copy">
          <p className="pfm-lux-eyebrow">Profit Flow Management</p>

          <h1>
            你的店真的有賺錢嗎？
            <span>美業獲利健檢™</span>
          </h1>

          <p className="pfm-lux-lead">
            透過獲利、成本、客戶經營與數位能力四大面向，
            快速找出影響營收與成長的關鍵問題。
          </p>

          <button className="btn pfm-lux-main-btn pfm-v72-main-btn" onClick={onStart}>
            立即開始免費健檢
          </button>

          <p className="pfm-v72-scope">
            <strong>適用對象</strong>
            <span>個人工作室｜小型店面｜多人店面｜連鎖／多店</span>
          </p>
        </div>

        <div className="pfm-lux-book-area pfm-v72-book-area">
          <img
            className="pfm-book-3d-img"
            src="/pfm-book-3d.webp"
            alt="PFM 美業獲利健檢報告"
          />
        </div>
      </section>

      <section className="pfm-lux-aspects" id="pfm-aspects">
        <div className="pfm-lux-title"><span />四大面向分析<span /></div>

        <div className="pfm-lux-aspect-grid">
          {aspectCards.map((card) => (
            <article key={card.title}>
              <PremiumIcon src={card.src} alt={card.alt} />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pfm-lux-pain" id="pfm-about">
        <h2>明明每天都很忙，為什麼帳戶裡還是沒有錢？</h2>

        <div className="pfm-lux-pain-grid">
          <article><GoldIcon type="coin" /><p>營收看起來不錯，<strong>但月底沒有留下多少利潤。</strong></p></article>
          <article><GoldIcon type="user" /><p>客人一直來，<strong>卻總是留不住。</strong></p></article>
          <article><GoldIcon type="loop" /><p>社群每天更新，<strong>業績卻沒有明顯成長。</strong></p></article>
          <article><GoldIcon type="question" /><p>不知道問題出在哪，<strong>只能不斷更努力工作。</strong></p></article>
        </div>
      </section>

      <section className="pfm-lux-preview" id="pfm-process">
        <div className="pfm-lux-title"><span />診斷預覽<span /></div>

        <div className="pfm-lux-preview-grid" id="pfm-value">
          <article><GoldIcon type="search" /><h3>三大問題</h3><p>找出影響獲利的關鍵阻礙</p></article>
          <article><GoldIcon type="diamond" /><h3>三大優勢</h3><p>發掘你的經營亮點</p></article>
          <article><GoldIcon type="stage" /><h3>成長階段</h3><p>了解目前所在的成長階段</p></article>
          <article><GoldIcon type="chart" /><h3>成長機會</h3><p>量化潛在成長與獲利空間</p></article>
        </div>
      </section>

      <section className="pfm-lux-proof" id="pfm-faq">
        <Laurel />
        <div>
          <h2>不要再靠感覺經營，開始用數據看懂你的店。</h2>
          <p>數據驅動決策，讓努力更有價值</p>
        </div>
        <Laurel />
      </section>
    </main>
  );
}
