import React, { useMemo } from 'react';

function safeNumber(value, fallback = 0) {
  const n = Number(String(value ?? '').replace(/[$,%\s,]/g, ''));
  return Number.isFinite(n) ? n : fallback;
}

function fmtMoney(value) {
  const n = safeNumber(value);
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function fmtPercent(value) {
  const n = safeNumber(value);
  return `${n.toFixed(2)}%`;
}

function fmtNumber(value, digits = 2) {
  const n = safeNumber(value);
  return n.toFixed(digits);
}

function pick(...values) {
  return values.find((v) => v !== undefined && v !== null && String(v).trim() !== '') ?? '';
}

function gradeByHigherBetter(value, excellent, good, caution) {
  const n = safeNumber(value);
  if (n >= excellent) return '優秀';
  if (n >= good) return '良好';
  if (n >= caution) return '注意';
  return '待改善';
}

function gradeByLowerBetter(value, excellent, good, caution) {
  const n = safeNumber(value);
  if (n <= excellent) return '優秀';
  if (n <= good) return '良好';
  if (n <= caution) return '注意';
  return '待改善';
}

function gradeClass(grade) {
  if (grade === '優秀') return 'is-excellent';
  if (grade === '良好' || grade === '穩定') return 'is-good';
  if (grade === '注意' || grade === '普通') return 'is-caution';
  return 'is-weak';
}

function IconBadge({ icon }) {
  return <span className="pfm-v17-icon-badge" aria-hidden="true">{icon}</span>;
}

function GradePill({ grade }) {
  if (!grade) return null;
  return <span className={`pfm-v17-grade-pill ${gradeClass(grade)}`}>{grade}</span>;
}

function ConsultantTip({ children }) {
  if (!children) return null;
  return (
    <div className="pfm-v17-tip">
      <span className="pfm-v17-tip-icon" aria-hidden="true">💡</span>
      <p>{children}</p>
    </div>
  );
}

function MetricCard({ icon, label, value, grade, desc, tip, className = '' }) {
  return (
    <article className={`pfm-v17-metric-card ${className}`.trim()}>
      <div className="pfm-v17-metric-head">
        <IconBadge icon={icon} />
        <div>
          <h4>{label}</h4>
          <GradePill grade={grade} />
        </div>
      </div>
      <div className="pfm-v17-metric-value">{value}</div>
      {desc && <p className="pfm-v17-metric-desc">{desc}</p>}
      <ConsultantTip>{tip}</ConsultantTip>
    </article>
  );
}

function Section({ chapter, icon, title, subtitle, children, className = '' }) {
  return (
    <section className={`pfm-v17-section ${className}`.trim()}>
      {(chapter || icon) && (
        <div className="pfm-v17-chapter-label">
          {icon && <IconBadge icon={icon} />}
          {chapter && <span>{chapter}</span>}
        </div>
      )}
      <h2>{title}</h2>
      {subtitle && <p className="pfm-v17-section-subtitle">{subtitle}</p>}
      {children}
    </section>
  );
}

function InsightBox({ children }) {
  return (
    <div className="pfm-v17-insight-box">
      <h4>本章重點發現</h4>
      <p>{children}</p>
    </div>
  );
}

function RadarChart({ scores }) {
  const size = 420;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 128;
  const labels = [
    { key: 'profit', text: '獲利能力' },
    { key: 'customer', text: '客戶經營' },
    { key: 'traffic', text: '流量能力' },
    { key: 'conversion', text: '轉換能力' },
    { key: 'brand', text: '品牌成熟' },
  ];

  const pointFor = (index, percent, extra = 0) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / labels.length;
    const r = radius * (percent / 100) + extra;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  };

  const polygon = labels
    .map((item, index) => pointFor(index, Math.max(0, Math.min(100, safeNumber(scores[item.key])))).join(','))
    .join(' ');

  return (
    <svg className="pfm-v17-radar" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="成長潛力雷達圖">
      {[20, 40, 60, 80, 100].map((pct) => (
        <polygon
          key={pct}
          points={labels.map((_, index) => pointFor(index, pct).join(',')).join(' ')}
          className="pfm-v17-radar-grid"
        />
      ))}
      {labels.map((_, index) => {
        const [x, y] = pointFor(index, 100);
        return <line key={index} x1={cx} y1={cy} x2={x} y2={y} className="pfm-v17-radar-axis" />;
      })}
      <polygon points={polygon} className="pfm-v17-radar-area" />
      <polyline points={`${polygon} ${polygon.split(' ')[0]}`} className="pfm-v17-radar-line" />
      {labels.map((item, index) => {
        const [x, y] = pointFor(index, 100, 42);
        return (
          <text key={item.key} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="pfm-v17-radar-label">
            {item.text}
          </text>
        );
      })}
    </svg>
  );
}

export default function ResultDashboard({ result = {}, formData = {}, onRestart }) {
  const data = result || {};
  const storeName = pick(data.storeName, formData.storeName, formData.contactName, '你的店');
  const storeType = pick(data.storeType, formData.storeType, data.businessType, formData.businessType, '美業店家');
  const category = pick(data.category, data.businessCategory, formData.businessCategory, formData.storeCategory, '美業');
  const month = pick(data.month, formData.month, '');

  const totalRevenue = safeNumber(pick(data.totalRevenue, data.revenue, data.monthlyRevenue, data.serviceRevenue, formData.serviceRevenue));
  const grossMargin = safeNumber(pick(data.grossMarginRate, data.grossMargin, data['毛利率']));
  const netMargin = safeNumber(pick(data.netMarginRate, data.netMargin, data['淨利率']));
  const returningRate = safeNumber(pick(data.returningRate, data.returnRate, data['回流率']));
  const avgTicket = safeNumber(pick(data.averageTicket, data.avgTicket, data.customerUnitPrice, data['客單價']));
  const paymentFeeRate = safeNumber(pick(data.paymentFeeRate, data.cashFlowFeeRate, data['金流手續費率']));
  const laborRate = safeNumber(pick(data.laborCostRate, data.staffCostRate, data['人事成本率']));
  const rentRate = safeNumber(pick(data.rentRate, data['租金率']));
  const adRate = safeNumber(pick(data.adRate, data.marketingRate, data['廣告率']));
  const cpa = safeNumber(pick(data.cpa, data.CPA));
  const roas = safeNumber(pick(data.roas, data.ROAS));
  const newCustomerRate = safeNumber(pick(data.newCustomerRate, data.newRate, data['新客率']));
  const referralRate = safeNumber(pick(data.referralRate, data.introductionRate, data['介紹客比例']));
  const customerPower = safeNumber(pick(data.customerPower, data.customerManagementPower, data['客戶經營力']));
  const socialScore = safeNumber(pick(data.socialScore, data.socialManagementScore, data['社群經營度']));
  const contentScore = safeNumber(pick(data.contentScore, data.contentExecutionScore, data['內容執行力']));
  const digitalScore = safeNumber(pick(data.digitalScore, data.digitalMaturityScore, data['數位成熟度']));
  const digitalGrade = pick(data.digitalGrade, data.digitalMaturityGrade, data['數位成熟度評級'], gradeByHigherBetter(digitalScore, 70, 50, 30));

  const overallScore = safeNumber(pick(data.newOverallScore, data.raw?.B50, data.overallScore, data.growthStageScore, data['新版綜合分數'], data['成長階段綜合分數']));
  const growthStage = pick(data.newGrowthStage, data.raw?.B51, data.growthStage, data.storeGrowthStage, data['新版成長階段'], data['店家成長階段'], '建構期');

  const problem1 = pick(data.problem1, data['問題1'], '回流率偏低');
  const problem2 = pick(data.problem2, data['問題2'], '客戶經營力不足');
  const problem3 = pick(data.problem3, data['問題3'], '目前無明顯問題');
  const strength1 = pick(data.strength1, data['優勢1'], '淨利率表現優秀');
  const strength2 = pick(data.strength2, data['優勢2'], '毛利率表現優秀');
  const strength3 = pick(data.strength3, data['優勢3'], '介紹客來源穩定');
  const firstPriority = pick(data.firstPriority, data['第一優先'], '建立回流機制');
  const hiddenCostText = pick(data.hiddenCostReminder, data['隱形成本提醒'], `本月非現金收款約 ${fmtMoney(totalRevenue)}，產生金流手續費 ${fmtMoney(totalRevenue * paymentFeeRate / 100)}（${fmtPercent(paymentFeeRate)}），若維持目前規模，一年約流失 ${fmtMoney(totalRevenue * paymentFeeRate / 100 * 12)} 的利潤，建議同步檢視金流結構與收款模式。`);
  const consultantStatus = pick(data.currentStatus, data['目前狀態'], `目前主要卡點在「${problem1}」，其次是「${problem2}」。`);
  const consultantOpportunity = pick(data.growthOpportunity, data['成長機會'], `目前最大優勢為「${strength1}」，可作為下一階段成長槓桿。`);
  const consultantDirection = pick(data.suggestionDirection, data['建議方向'], `建議優先針對「${problem1}」建立改善策略，並從「${firstPriority}」開始執行。`);

  const profitGrade = gradeByHigherBetter(grossMargin, 80, 70, 60);
  const netGrade = gradeByHigherBetter(netMargin, 30, 20, 10);
  const returnGrade = gradeByHigherBetter(returningRate, 40, 25, 15);
  const avgTicketGrade = gradeByHigherBetter(avgTicket, 4000, 2500, 1500);
  const feeGrade = gradeByLowerBetter(paymentFeeRate, 1.5, 3, 5);
  const laborGrade = gradeByLowerBetter(laborRate, 25, 35, 45);
  const rentGrade = gradeByLowerBetter(rentRate, 10, 15, 20);
  const adGrade = gradeByLowerBetter(adRate, 8, 12, 18);
  const customerPowerGrade = customerPower >= 8 ? '優秀' : customerPower >= 6 ? '穩定' : customerPower >= 4 ? '注意' : '薄弱';
  const roasGrade = roas >= 8 ? '優秀' : roas >= 5 ? '良好' : roas >= 3 ? '注意' : '偏低';

  const radarScores = useMemo(() => {
    const profitScore = safeNumber(pick(data.profitScore, data.raw?.B46, data['獲利能力分數']), Math.round((safeNumber(grossMargin) + safeNumber(netMargin)) / 2));
    const customerScore = safeNumber(pick(data.customerMaturityScore, data.raw?.B47, data['客戶經營成熟度分數']), Math.round((returningRate + referralRate + customerPower * 10) / 3));
    const trafficScore = safeNumber(pick(data.trafficContentScore, data.raw?.B48, data['流量內容成熟度分數']), Math.round((socialScore + contentScore + digitalScore) / 3));
    const conversionScore = safeNumber(pick(data.adConversionScore, data.raw?.B49, data['廣告轉換效率分數']), Math.round((Math.min(roas, 10) * 10 + (cpa > 0 ? Math.max(0, 100 - cpa / 40) : 30)) / 2));
    return {
      profit: profitScore,
      customer: customerScore,
      traffic: trafficScore,
      conversion: conversionScore,
      brand: digitalScore || trafficScore,
    };
  }, [data, grossMargin, netMargin, returningRate, referralRate, customerPower, socialScore, contentScore, digitalScore, roas, cpa]);

  return (
    <main className="pfm-v17-result-page">
      <section className="pfm-v17-hero-card">
        <div className="pfm-v17-hero-copy">
          <p className="pfm-v17-eyebrow">PFM 美業獲利健檢結果</p>
          <h1>{storeName}｜經營診斷結果</h1>
          <p>目前已具備成長條件，可開始建立流量、會員與獲利管理系統。</p>
          <div className="pfm-v17-tags">
            <span>{storeType}</span>
            <span>{category}</span>
            {month && <span>{month}</span>}
          </div>
        </div>
        <div className="pfm-v17-stage-card">
          <p>店家成長階段</p>
          <strong>{growthStage}</strong>
          <div className="pfm-v17-score-circle">{fmtNumber(overallScore, 2)}</div>
          <span>綜合分數</span>
        </div>
      </section>

      <Section title="獲利健康度總覽" subtitle="先看最直接影響獲利與經營穩定度的核心指標。" className="pfm-v17-overview-section">
        <div className="pfm-v18-overview-core-row">
          <MetricCard icon="💰" label="毛利率" value={fmtPercent(grossMargin)} grade={profitGrade} desc="服務定價與成本控制。" tip="毛利率維持在健康區間，代表目前服務定價與直接成本控制有基礎。" />
          <MetricCard icon="📈" label="淨利率" value={fmtPercent(netMargin)} grade={netGrade} desc="真正留下的獲利能力。" tip="淨利率是能否持續成長的核心，數值越穩定代表經營體質越健康。" />
          <MetricCard icon="🔁" label="回流率" value={fmtPercent(returningRate)} grade={returnGrade} desc="顧客再次消費比例。" tip="回流率是美業獲利關鍵，建議持續建立固定回訪與會員機制。" />
        </div>

        <div className="pfm-v18-overview-support-row">
          <MetricCard icon="💳" label="客單價" value={fmtMoney(avgTicket)} grade={avgTicketGrade} desc="單次消費金額與服務價值。" tip="客單價反映服務價值與組合設計，可搭配加購與套票提升。" />
          <MetricCard icon="🏦" label="金流手續費率" value={fmtPercent(paymentFeeRate)} grade={feeGrade} desc="非現金收款平台成本占營收比例。" tip="金流費用不一定會被第一時間感覺到，但會直接影響實際留下來的淨利。" />
        </div>
      </Section>

      <section className="pfm-v17-two-col">
        <div className="pfm-v17-list-card is-problem">
          <span className="pfm-v17-status-dot" />
          <h2>目前最需要處理的三件事</h2>
          <p>優先看會影響獲利、回流與成長速度的關鍵問題。</p>
          {[problem1, problem2, problem3].map((item, index) => (
            <div className="pfm-v17-list-item" key={`${item}-${index}`}>
              <b>{index + 1}</b>
              <div><strong>{item}</strong><span>優先處理，避免持續影響獲利與成長。</span></div>
            </div>
          ))}
        </div>
        <div className="pfm-v17-list-card is-strength">
          <span className="pfm-v17-status-dot" />
          <h2>目前最值得放大的三個優勢</h2>
          <p>不是只找問題，也要看見你已經做對的地方。</p>
          {[strength1, strength2, strength3].map((item, index) => (
            <div className="pfm-v17-list-item" key={`${item}-${index}`}>
              <b>{index + 1}</b>
              <div><strong>{item}</strong><span>建議放大，成為下一階段成長支點。</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="pfm-v17-hidden-cost">
        <div>
          <p className="pfm-v17-eyebrow">⚠ 隱形成本提醒</p>
          <h2>金流手續費正在持續吃掉你的淨利</h2>
          <p>{hiddenCostText}</p>
        </div>
        <div className="pfm-v17-hidden-number">
          <span>本期金流手續費率</span>
          <strong>{fmtPercent(paymentFeeRate)}</strong>
          <p>若維持目前規模，這類費用會持續累積成年度獲利流失。</p>
        </div>
      </section>

      <section className="pfm-v17-blueprint-nav">
        <p className="pfm-v17-eyebrow">店家成長藍圖</p>
        <h2>從「知道問題」進入「理解原因」</h2>
        <p>以下內容將目前健檢數據整理成顧問視角，協助你看見獲利、客戶、流量與下一步改善方向。</p>
        <div>
          <span>💰 獲利結構</span><span>👥 客戶經營</span><span>📣 流量內容</span><span>🎯 廣告效率</span><span>⭐ 成長潛力</span><span>🚀 90天改善</span>
        </div>
      </section>

      <Section chapter="第一章" icon="💰" title="獲利結構分析" subtitle="獲利不是只看營收，而是看毛利、淨利與成本是否能留下錢。" className="pfm-v17-profit-section">
        <div className="pfm-v17-profit-top">
          <MetricCard className="is-revenue" icon="💵" label="本月營收" value={fmtMoney(totalRevenue)} desc="本月整體營收規模。" tip="營收代表規模，但需要搭配毛利與淨利判斷是否真的有留下錢。" />
          <MetricCard icon="📈" label="毛利率" value={fmtPercent(grossMargin)} grade={profitGrade} desc="服務定價與成本控制。" tip="毛利率維持在80%以上，顯示定價策略與成本控管具備健康基礎。" />
          <MetricCard icon="💎" label="淨利率" value={fmtPercent(netMargin)} grade={netGrade} desc="真正留下的獲利能力。" tip="淨利率表現穩定，代表營運模式能有效轉化為淨利。" />
        </div>
        <div className="pfm-v17-profit-bottom">
          <MetricCard icon="👤" label="人事成本率" value={fmtPercent(laborRate)} grade={laborGrade} desc="人力成本控制狀況。" tip="人事成本控制得宜，建議可持續投資人才以支持業務成長。" />
          <MetricCard icon="🏢" label="租金率" value={fmtPercent(rentRate)} grade={rentGrade} desc="租金與營收匹配度。" tip="租金占比在合理範圍內，持續維持現況有助於獲利穩定。" />
          <MetricCard icon="📣" label="廣告率" value={fmtPercent(adRate)} grade={adGrade} desc="行銷投資占營收比例。" tip="廣告投資占比偏高時，建議優化廣告策略以提升投資報酬率（ROAS）。" />
          <MetricCard icon="💳" label="金流手續費率" value={fmtPercent(paymentFeeRate)} grade={feeGrade} desc="支付與收款成本。" tip="金流費用占比偏高，可評估更優惠的金流方案以降低成本。" />
        </div>
        <div className="pfm-v17-standard-box">
          <h4>評級基準說明</h4>
          <p>評級標準參考美業常見經營模型、成本結構與 PFM 顧問診斷基準，用於協助店家快速理解目前數據所代表的經營狀態。</p>
        </div>
        <InsightBox>毛利率與淨利率是獲利能力的核心觀察點；若金流、廣告或固定成本偏高，即使營收不差，也可能讓實際留下來的錢被稀釋。</InsightBox>
      </Section>

      <Section chapter="第二章" icon="👥" title="客戶經營分析" subtitle="回流、新客與介紹客的比例，會決定你是靠穩定經營，還是一直追新客。">
        <div className="pfm-v17-metric-grid four">
          <MetricCard icon="👤" label="新客率" value={fmtPercent(newCustomerRate)} desc="新客開發能力。" tip="新客率代表開發能力，但若過高且回流偏低，可能表示經營仍依賴不斷找新客。" />
          <MetricCard icon="🔁" label="回流率" value={fmtPercent(returningRate)} grade={returnGrade} desc="顧客再次消費比例。" tip="回流率是美業穩定獲利的關鍵，建議建立固定回訪提醒與會員標籤。" />
          <MetricCard icon="🤝" label="介紹客比例" value={fmtPercent(referralRate)} desc="信任與口碑來源。" tip="介紹客代表信任與口碑，若比例穩定，可放大成轉介紹機制。" />
          <MetricCard icon="🏆" label="客戶經營力" value={`${fmtNumber(customerPower, 2)} / 10`} grade={customerPowerGrade} desc="顧客經營成熟程度。" tip="客戶經營力會影響回購、轉介紹與長期營收穩定度。" />
        </div>
        <InsightBox>客戶經營的重點不只是新客，而是讓顧客願意再次回來、願意介紹，進一步降低獲客壓力與廣告依賴。</InsightBox>
      </Section>

      <Section chapter="第三章" icon="📣" title="流量與內容能力" subtitle="PFM 不鼓勵盲目投廣告，而是先看目前是否具備自然流量與內容經營基礎。">
        <div className="pfm-v17-metric-grid four">
          <MetricCard icon="📱" label="社群經營度" value={fmtNumber(socialScore, 2)} desc="自然曝光與社群基礎。" tip="社群經營度反映自然曝光基礎，穩定內容能降低未來獲客成本。" />
          <MetricCard icon="✍️" label="內容執行力" value={fmtNumber(contentScore, 2)} desc="內容持續產出能力。" tip="內容執行力代表能否持續讓潛在顧客理解服務價值。" />
          <MetricCard icon="🌐" label="數位成熟度" value={fmtNumber(digitalScore, 2)} desc="數位化管理程度。" tip="數位成熟度會影響預約流程、顧客管理與後續放大效率。" />
          <MetricCard icon="📊" label="數位成熟度評級" value={digitalGrade} desc="數位經營整體評估。" tip="若評級偏弱，建議先建立固定內容節奏與基本顧客資料管理。" />
        </div>
        <InsightBox>流量與內容能力會影響未來獲客穩定度。若數位成熟度偏弱，建議先建立固定內容節奏，再進一步放大廣告投放。</InsightBox>
      </Section>

      <Section chapter="第四章" icon="🎯" title="轉換漏斗與廣告效率" subtitle="流量進來後，有沒有成功變成客戶？CPA 用來看每成交一位客人的廣告成本；ROAS 用來看每 1 元廣告費帶回多少營收。">
        <div className="pfm-v17-funnel-flow">
          <strong>轉換路徑</strong><span>曝光</span><em>→</em><span>詢問</span><em>→</em><span>預約</span><em>→</em><span>成交</span>
          <p>目前以 CPA、ROAS 與金流手續費率作為轉換效率的主要代理指標。</p>
        </div>
        <div className="pfm-v17-metric-grid three">
          <MetricCard icon="👤" label="CPA" value={cpa > 0 ? Math.round(cpa).toLocaleString('en-US') : '尚無成交資料'} desc="取得一位成交客成本。" tip="CPA 可判斷取得一位客人的成本是否過高，需搭配客單價與回流率一起評估。" />
          <MetricCard icon="📈" label="ROAS" value={roas > 0 ? fmtNumber(roas, 2) : '未投放廣告'} desc="每1元廣告帶回營收。" tip="ROAS 代表廣告投資回收效率，若偏低應優先檢查素材、受眾與成交流程。" />
          <MetricCard icon="💳" label="金流手續費率" value={fmtPercent(paymentFeeRate)} desc="非現金收款平台成本占營收比例。" tip="金流手續費是容易被忽略的隱形成本，需納入淨利率判斷。" />
        </div>
        <div className="pfm-v17-ad-grade">
          <h4>廣告效率評級</h4>
          <strong>{roasGrade}</strong>
          <p>{roas >= 8 ? '每投入 1 元廣告費，可創造良好營收。建議持續優化素材與受眾，同時強化會員經營與回流機制。' : '廣告效率仍有提升空間，建議優先檢查廣告素材、受眾設定與成交流程。'}</p>
        </div>
        <InsightBox>廣告效率不是只看有沒有投放，而是看流量進來後能否被預約、成交與回流承接。</InsightBox>
      </Section>

      <Section chapter="第五章" icon="⭐" title="成長潛力藍圖" subtitle="用五個面向快速看見目前店家的經營輪廓與下一步放大方向。">
        <div className="pfm-v17-radar-layout">
          <div className="pfm-v17-radar-card"><RadarChart scores={radarScores} /></div>
          <div className="pfm-v17-radar-explain">
            <h3>五大構面來源</h3>
            <dl>
              <div><dt>獲利能力</dt><dd>對應第一章：毛利率、淨利率與成本控制。</dd></div>
              <div><dt>客戶經營</dt><dd>對應第二章：回流率、介紹客與客戶經營力。</dd></div>
              <div><dt>流量能力</dt><dd>對應第三章：社群經營、內容執行與自然曝光基礎。</dd></div>
              <div><dt>轉換能力</dt><dd>對應第四章：CPA、ROAS 與成交承接效率。</dd></div>
              <div><dt>品牌成熟</dt><dd>對應第三章：數位成熟度與系統化經營能力。</dd></div>
            </dl>
            <div className="pfm-v17-radar-grade"><span>綜合評級</span><strong>{pick(data.growthPotentialGrade, data['成長潛力評級'], overallScore >= 80 ? '優秀' : overallScore >= 65 ? '良好' : overallScore >= 50 ? '中' : '低')}</strong><p>目前最大優勢為「{strength1}」，可作為下一階段成長槓桿。</p></div>
          </div>
        </div>
      </Section>

      <Section chapter="第六章" icon="🚀" title="90天優先改善路徑" subtitle="將目前診斷結果轉換成可執行的三步驟，避免只知道問題，卻不知道下一步要做什麼。">
        <div className="pfm-v17-roadmap">
          <article><b>1</b><div><span>STEP 1</span><h4>{firstPriority}</h4><p>讓回流率往 35% 以上提升。</p></div></article>
          <article><b>2</b><div><span>STEP 2</span><h4>優化金流與廣告成本</h4><p>降低隱形成本，提升每一筆成交留下來的淨利。</p></div></article>
          <article><b>3</b><div><span>STEP 3</span><h4>建立會員經營系統</h4><p>用標籤、回訪與再購流程提升客戶終身價值。</p></div></article>
        </div>
      </Section>

      <Section chapter="第七章" icon="🧭" title="顧問診斷結論">
        <div className="pfm-v17-consultant-grid">
          <article><h4>目前狀態</h4><p>{consultantStatus}</p></article>
          <article><h4>最大機會</h4><p>{consultantOpportunity}</p></article>
          <article><h4>建議方向</h4><p>{consultantDirection}</p></article>
        </div>
        <div className="pfm-v17-final-cta">
          <h2>問題已經找到，下一步是把數據轉成真正的獲利。</h2>
          <p>{consultantDirection}</p>
          <a href="https://line.me/" target="_blank" rel="noreferrer">Line｜預約 PFM 一對一診斷</a>
        </div>
      </Section>
    </main>
  );
}
