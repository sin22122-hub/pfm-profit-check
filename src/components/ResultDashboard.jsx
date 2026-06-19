import React, { useState } from 'react';

const statusTone = (value = '') => {
  if (['優秀', '健康', '良好', '極高', '高', '成長期', '擴張期'].includes(value)) return 'good';
  if (['普通', '穩定', '中', '待改善', '穩定期'].includes(value)) return 'warn';
  if (['需改善', '偏高', '危險', '偏弱', '低', '薄弱', '求生期'].includes(value)) return 'risk';
  return '';
};

const display = (value, fallback = '-') => {
  if (value === undefined || value === null || value === '') return fallback;
  return value;
};

const MetricCard = ({ label, value, sub, tone, large = false }) => (
  <div className={`pfm-card metric-card-v12 ${tone ? `tone-${tone}` : ''} ${large ? 'large' : ''}`}>
    <span>{label}</span>
    <strong>{display(value)}</strong>
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

        <div className="stage-panel-v12">
          <span>店家成長階段</span>
          <strong>{display(result.growthStage)}</strong>
          <div className="score-ring-v12">{display(result.growthScore)}</div>
          <p>綜合分數</p>
        </div>
      </section>

      <Section title="四大核心指標" intro="先看最直接影響獲利與經營穩定度的四個指標。">
        <div className="metric-grid-v12 four">
          <MetricCard label="毛利率" value={result.grossMargin} />
          <MetricCard label="淨利率" value={result.netMargin} />
          <MetricCard label="回流率" value={result.returnRate} />
          <MetricCard label="客單價" value={`$${display(result.averageOrderValue)}`} />
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
          <MetricCard label="可轉化營收" value={result.convertibleRevenue} />
          <MetricCard label="可提升獲利" value={result.profitGrowthRoom} />
          <MetricCard label="成長潛力評級" value={result.growthPotentialLevel} tone={statusTone(result.growthPotentialLevel)} />
        </div>
      </Section>

      <section className="hidden-cost-card-v12">
        <div>
          <p className="pfm-eyebrow">你可能忽略的隱形成本</p>
          <h2>金流手續費正在持續吃掉你的淨利</h2>
          <p>{display(result.hiddenCostWarning)}</p>
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
            <div className="metric-grid-v12 seven">
              <MetricCard label="本月營收" value={`$${display(result.totalRevenue)}`} />
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

          <Section title="第四章｜轉換漏斗與廣告效率" intro="這裡用來看廣告與名單是否有效，不代表 PFM 鼓勵依賴廣告。">
            <div className="metric-grid-v12 six">
              <MetricCard label="CPA" value={result.cpa} />
              <MetricCard label="ROAS" value={result.roas} />
              <MetricCard label="金流手續費率" value={result.paymentFeeRate} />
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
              <a className="btn" href="#" target="_blank" rel="noreferrer">
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
