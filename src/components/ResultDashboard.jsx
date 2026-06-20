import React, { useState } from 'react';

// TODO: 貼上正式預約連結後，將空字串改成你的 LINE / 預約頁網址。
const BOOKING_URL = '';

const statusTone = (value = '') => {
  if (['優秀', '健康', '良好', '極高', '高', '成長期', '擴張期', '卓越'].includes(value)) return 'good';
  if (['普通', '穩定', '中', '待改善', '穩定期'].includes(value)) return 'warn';
  if (['需改善', '偏高', '危險', '偏弱', '低', '薄弱', '求生期'].includes(value)) return 'risk';
  return '';
};

const display = (value, fallback = '-') => {
  if (value === undefined || value === null || value === '') return fallback;
  return value;
};

const money = (value) => {
  const text = display(value);
  if (text === '-') return text;
  return String(text).startsWith('$') ? text : `$${text}`;
};

const toNumber = (value) => {
  if (value === undefined || value === null || value === '') return 0;
  return Number(String(value).replace(/[$,%\s,]/g, '')) || 0;
};

const getRoasLevel = (roas) => {
  const value = toNumber(roas);
  if (value >= 20) return '卓越';
  if (value >= 10) return '優秀';
  if (value >= 5) return '良好';
  if (value >= 3) return '普通';
  return '偏低';
};

const getRoasInsight = (roas) => {
  const value = toNumber(roas).toFixed(2);
  const level = getRoasLevel(roas);

  if (level === '卓越') {
    return `每投入 1 元廣告費，可創造約 ${value} 元營收。廣告效率非常卓越，目前廣告不是主要瓶頸，下一步應優先檢查回流率、客單價與服務產能。`;
  }

  if (level === '優秀') {
    return `每投入 1 元廣告費，可創造約 ${value} 元營收。廣告效率表現優秀，可持續優化素材與受眾，同時強化會員經營與回流機制。`;
  }

  if (level === '良好') {
    return `每投入 1 元廣告費，可創造約 ${value} 元營收。廣告效率良好，建議持續測試素材，並提升預約與成交轉換率。`;
  }

  if (level === '普通') {
    return `每投入 1 元廣告費，可創造約 ${value} 元營收。廣告效率普通，建議檢查廣告內容、受眾設定與預約流程。`;
  }

  return `每投入 1 元廣告費，只創造約 ${value} 元營收。廣告效率偏低，建議優先檢查廣告素材、受眾設定與成交流程。`;
};

const noWrapStrongStyle = {
  whiteSpace: 'nowrap',
  wordBreak: 'keep-all',
  overflowWrap: 'normal',
  fontVariantNumeric: 'tabular-nums',
};

const MetricCard = ({ label, value, sub, tone, large = false }) => (
  <div className={`pfm-card metric-card-v12 ${tone ? `tone-${tone}` : ''} ${large ? 'large' : ''}`}>
    <span>{label}</span>
    <strong style={noWrapStrongStyle}>{display(value)}</strong>
    {sub && <p>{sub}</p>}
  </div>
);

const Section = ({ eyebrow, title, intro, children, className = '' }) => (
  <section className={`pfm-section ${className}`}>
    {eyebrow && <p className="pfm-eyebrow">{eyebrow}</p>}
    <div className="pfm-section-head">
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
    {children}
  </section>
);

const RankCards = ({ items = [], type = 'problem' }) => (
  <div className={`rank-card-grid ${type}`}>
    {items.map((item, index) => (
      <div className="pfm-card rank-card-v12" key={`${type}-${item}-${index}`}>
        <div className="rank-number">{index + 1}</div>
        <p>{display(item)}</p>
      </div>
    ))}
  </div>
);

const StepCards = ({ items = [] }) => (
  <div className="step-grid-v12">
    {items.map((item, index) => (
      <div className="pfm-card step-card-v12" key={`${item}-${index}`}>
        <span>STEP {index + 1}</span>
        <strong>{display(item)}</strong>
      </div>
    ))}
  </div>
);

export default function ResultDashboard({ result, formData = {}, onRestart }) {
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState('');

  if (!result) return null;

  const problems = [result.problem1, result.problem2, result.problem3].filter(Boolean);
  const strengths = [result.strength1, result.strength2, result.strength3].filter(Boolean);
  const actions = [result.priority1, result.priority2, result.priority3].filter(Boolean);

  const roasLevel = getRoasLevel(result.roas);
  const roasInsight = getRoasInsight(result.roas);

  const unlockBlueprint = () => {
    setUnlocked(true);
    setTimeout(() => {
      document.getElementById('growth-blueprint')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 80);
  };

  return (
    <main className="pfm-result-page">
      <section className="pfm-result-hero">
        <div className="hero-copy-v12">
          <p className="pfm-eyebrow">PFM 美業獲利健檢結果</p>
          <h1>{display(formData.storeName, '你的店家')}｜經營診斷結果</h1>
          <p>{display(result.stageComment)}</p>

          <div className="hero-tags-v12">
            <span>{display(result.businessType || formData.businessType)}</span>
            <span>{Array.isArray(formData.storeType) ? formData.storeType.join('、') : display(formData.storeType)}</span>
            <span>{display(formData.month, '本期資料')}</span>
          </div>
        </div>

        <div
  className="stage-panel-v12"
  style={{
    position: 'relative',
    overflow: 'hidden',
  }}
>
  <div
    style={{
      position: 'absolute',
      right: '18px',
      top: '-18px',
      fontSize: '110px',
      fontWeight: 800,
      lineHeight: 1,
      color: '#2F4A42',
      opacity: 0.025,
      pointerEvents: 'none',
      userSelect: 'none',
      zIndex: 0,
    }}
  >
    PFM
  </div>

  <div style={{ position: 'relative', zIndex: 1 }}>
    <span>店家成長階段</span>
    <strong>{display(result.growthStage)}</strong>
    <div className="score-ring-v12">{display(result.growthScore)}</div>
    <p>綜合分數</p>
  </div>
</div>
      </section>

      <Section title="四大核心指標" intro="先看最直接影響獲利與經營穩定度的四個指標。">
        <div className="metric-grid-v12 four">
          <MetricCard label="毛利率" value={result.grossMargin} />
          <MetricCard label="淨利率" value={result.netMargin} />
          <MetricCard label="回流率" value={result.returnRate} />
          <MetricCard label="客單價" value={money(result.averageOrderValue)} />
        </div>
      </Section>

      <div className="two-col-v12">
        <Section title="目前最需要處理的三件事" intro="優先看會影響獲利、回流與成長速度的關鍵問題。">
          <RankCards items={problems} type="problem" />
        </Section>

        <Section title="目前最值得放大的三個優勢" intro="不是只找問題，也要看見你已經做對的地方。">
          <RankCards items={strengths} type="strength" />
        </Section>
      </div>

      <Section title="建議改善順序" intro="依照目前診斷結果，建議先從這三個方向開始。">
        <StepCards items={actions} />
      </Section>

      <Section title="獲利成長機會分析" intro="這裡不是承諾營收，而是協助你看見目前經營結構中可能被放大的空間。">
        <div className="metric-grid-v12 four">
          <MetricCard label="回流提升空間" value={result.returnGrowthRoom} />
          <MetricCard label="可轉化營收" value={money(result.convertibleRevenue)} />
          <MetricCard label="可提升獲利" value={money(result.profitGrowthRoom)} />
          <MetricCard label="成長潛力評級" value={result.growthPotentialLevel} tone={statusTone(result.growthPotentialLevel)} />
        </div>
      </Section>

      <section
        className="hidden-cost-card-v12"
        style={{
          display: 'block',
          padding: '48px 56px',
          maxWidth: '1280px',
          margin: '40px auto',
        }}
      >
        <div style={{ maxWidth: '920px' }}>
          <p className="pfm-eyebrow">你可能忽略的隱形成本</p>
          <h2 style={{ marginTop: '8px', marginBottom: '20px' }}>金流手續費正在持續吃掉你的淨利</h2>
          <p style={{ lineHeight: 1.9, maxWidth: '920px' }}>{display(result.hiddenCostWarning)}</p>
          <p style={{ lineHeight: 1.8, maxWidth: '920px', opacity: 0.86, marginTop: '18px' }}>
            這類費用通常不會被老闆第一時間感覺到，但它會直接降低實際留下來的淨利。
          </p>
        </div>
      </section>

      {!unlocked && (
        <section className="unlock-blueprint-v12">
          <p className="pfm-eyebrow">免費解鎖</p>
          <h2>店家成長藍圖已產生</h2>
          <p>看懂結果只是開始。解鎖後可查看你的獲利結構、客戶結構、流量內容能力、成長瓶頸與顧問建議。</p>

          <div className="email-unlock-row-v12">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="輸入 Email 免費解鎖"
            />
            <button className="btn" onClick={unlockBlueprint}>
              免費解鎖店家成長藍圖
            </button>
          </div>
        </section>
      )}

      {unlocked && (
        <section id="growth-blueprint" className="blueprint-page-v12">
          <div className="blueprint-hero-v12">
            <p className="pfm-eyebrow">店家成長藍圖</p>
            <h2>從「知道問題」進入「理解原因」</h2>
            <p>以下內容將目前的健檢數據整理成顧問視角，協助你看見獲利、客戶、流量與下一步改善方向。</p>
          </div>

          <Section title="第一章｜獲利結構分析" intro="獲利不是只看營收，而是看毛利、淨利與成本是否能留下錢。">
            <div
              className="metric-grid-v12 seven"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}
            >
              <MetricCard label="本月營收" value={money(result.totalRevenue)} />
              <MetricCard label="毛利率" value={result.grossMargin} />
              <MetricCard label="淨利率" value={result.netMargin} />
              <MetricCard label="人事成本率" value={result.hrCostRate} />
              <MetricCard label="租金率" value={result.rentRate} />
              <MetricCard label="廣告率" value={result.adRate} />
              <MetricCard label="金流手續費率" value={result.paymentFeeRate} />
            </div>
          </Section>

          <Section title="第二章｜客戶結構分析" intro="回流、新客與介紹客的比例，會決定你是靠穩定經營，還是一直追新客。">
            <div className="metric-grid-v12 four">
              <MetricCard label="新客率" value={result.newCustomerRate} />
              <MetricCard label="介紹客比例" value={result.referralRate} />
              <MetricCard label="客戶經營力" value={`${display(result.customerScore)} / 10`} />
              <MetricCard label="客戶經營力評級" value={result.customerLevel} tone={statusTone(result.customerLevel)} />
            </div>
          </Section>

          <Section title="第三章｜流量與內容能力" intro="PFM 不鼓勵盲目投廣告，而是先看目前是否具備自然流量與內容經營基礎。">
            <div className="metric-grid-v12 four">
              <MetricCard label="社群經營度" value={result.socialScore} />
              <MetricCard label="內容執行力" value={result.contentScore} />
              <MetricCard label="數位成熟度" value={result.digitalScore} />
              <MetricCard label="數位成熟度評級" value={result.digitalLevel} tone={statusTone(result.digitalLevel)} />
            </div>
          </Section>

          <Section
  title="第四章｜轉換漏斗與廣告效率"
  intro="這裡用來判斷廣告是否真正帶來成交與營收，不代表 PFM 鼓勵依賴廣告，而是協助你看清每一筆廣告成本是否值得。"
>
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '24px',
    }}
  >
    <div
      className="metric-grid-v12"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))',
        gap: '20px',
      }}
    >
      <MetricCard
        label="CPA"
        value={result.cpa}
        sub="每成交一位客人的廣告總成本"
      />
      <MetricCard
        label="ROAS"
        value={result.roas}
        sub="每 1 元廣告成本創造的營收倍數"
      />
      <MetricCard
        label="金流手續費率"
        value={result.paymentFeeRate}
        sub="非現金收款平台成本占營收比例"
      />
    </div>

    <div
      className={`pfm-card tone-${statusTone(roasLevel)}`}
      style={{
        padding: '32px 36px',
        borderRadius: '24px',
      }}
    >
      <span style={{ color: '#D6A746', fontSize: '15px' }}>
        廣告效率評級
      </span>

      <strong
        style={{
          display: 'block',
          fontSize: '36px',
          lineHeight: 1.2,
          marginTop: '12px',
          marginBottom: '16px',
        }}
      >
        {roasLevel}
      </strong>

      <p
        style={{
          lineHeight: 1.9,
          margin: 0,
          maxWidth: '880px',
        }}
      >
        {roasInsight}
      </p>
    </div>
  </div>
</Section>

          <Section title="第五章｜成長瓶頸與顧問診斷">
            <div className="narrative-grid-v12">
              <div className="pfm-card">
                <h3>目前狀態</h3>
                <p>{display(result.currentStatus)}</p>
              </div>
              <div className="pfm-card">
                <h3>成長機會</h3>
                <p>{display(result.growthOpportunity)}</p>
              </div>
              <div className="pfm-card">
                <h3>建議方向</h3>
                <p>{display(result.suggestionDirection)}</p>
              </div>
            </div>
          </Section>

          <Section title="第六章｜90天優先改善路徑">
            <StepCards items={actions} />

            <div className="cta-panel-v12">
              <p>{display(result.nextAction)}</p>
              <a className="btn" href={BOOKING_URL || '#'} target="_blank" rel="noreferrer">
                {display(result.bookingText, '預約 PFM 一對一診斷')}
              </a>
            </div>
          </Section>
        </section>
      )}

      <div className="result-actions-v12">
        <button className="btn secondary" onClick={onRestart}>
          重新健檢
        </button>
      </div>
    </main>
  );
}
