import React, { useMemo, useState } from 'react';

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
      <h4>PFM 顧問解讀</h4>
      <p>{children}</p>
    </div>
  );
}


function stageSummary(score, stage = '') {
  const s = safeNumber(score);
  const stageText = String(stage || '');
  if (stageText.includes('擴張') || s >= 90) return '獲利體質已相對成熟，下一步可放大會員經營、團隊分工與流量規模。';
  if (stageText.includes('優化') || s >= 80) return '經營模式逐漸穩定，下一步建議優化回流、轉換效率與內容承接系統。';
  if (stageText.includes('建構') || s >= 70) return '目前已具備成長條件，可開始建立流量、會員與獲利管理系統。';
  if (s >= 60) return '經營模式尚未完全穩定，建議優先修復獲利結構、回流機制與成本控管。';
  return '目前營運風險偏高，建議先回到核心數據，優先處理獲利、成本與客戶回流問題。';
}

function overviewFindings({ profitGrade, netGrade, returnGrade, avgTicketGrade, feeGrade, grossMargin, netMargin, returningRate, avgTicket, paymentFeeRate }) {
  const findings = [];

  if (profitGrade === '優秀' && netGrade === '優秀') {
    findings.push(`毛利率 ${fmtPercent(grossMargin)}、淨利率 ${fmtPercent(netMargin)} 表現優秀，代表目前具備健康的獲利基礎。`);
  } else if (profitGrade === '待改善' || netGrade === '待改善') {
    findings.push('毛利率或淨利率仍有壓力，建議優先檢視定價、直接成本與固定費用。');
  } else {
    findings.push('獲利結構已有基礎，但仍需持續觀察毛利、淨利與成本之間的平衡。');
  }

  if (returnGrade === '優秀' || returnGrade === '良好') {
    findings.push(`回流率 ${fmtPercent(returningRate)} 已具備穩定顧客基礎，可進一步設計會員與再購機制。`);
  } else {
    findings.push(`回流率 ${fmtPercent(returningRate)} 仍有提升空間，建議建立固定回訪、會員標籤與再購提醒。`);
  }

  if (avgTicketGrade === '待改善' || avgTicketGrade === '注意') {
    findings.push(`客單價 ${fmtMoney(avgTicket)} 偏低，建議透過加購、套票、療程組合或高價值服務設計提升單次消費。`);
  } else {
    findings.push(`客單價 ${fmtMoney(avgTicket)} 表現穩定，可持續放大高價值服務與組合方案。`);
  }

  if (feeGrade === '待改善' || feeGrade === '注意') {
    findings.push(`金流手續費率 ${fmtPercent(paymentFeeRate)} 偏高，建議檢視支付工具、非現金收款比例與平台費率。`);
  }

  return findings;
}

function includesAny(text, keywords) {
  const source = String(text || '');
  return keywords.some((keyword) => source.includes(keyword));
}


function problemAdvice(problem, index = 0) {
  const item = String(problem || '');
  if (includesAny(item, ['淨利', '固定費', '租金', '人事'])) {
    return {
      summary: '實際留下來的利潤偏低，代表營收雖然進來，但可能被租金、人事、行銷或其他固定費用稀釋。',
      risk: '營收上升時不一定能同步轉成獲利，一遇到淡季或成本增加，現金壓力會被放大。',
      action: '先列出固定費用、租金、人事與行銷支出占比，找出最容易調整的獲利缺口。',
    };
  }
  if (includesAny(item, ['毛利', '耗材', '直接成本', '定價'])) {
    return {
      summary: '服務本身的定價或直接成本結構出現壓力，代表每做一筆服務留下來的毛利不夠穩。',
      risk: '即使客量增加，若單次服務毛利不足，會越忙越累，卻不一定真正賺到錢。',
      action: '先盤點高耗材、高工時、低毛利項目，重新檢查定價、材料成本與服務組合。',
    };
  }
  if (includesAny(item, ['回流', '老客', '再訪'])) {
    return {
      summary: '老客再次消費比例不足，代表會員經營、回訪提醒或再購流程尚未形成穩定循環。',
      risk: '若持續依賴新客，廣告與流量成本會逐月墊高，營收也容易出現波動。',
      action: '先建立 30 天回訪提醒、會員標籤與固定再購方案。',
    };
  }
  if (includesAny(item, ['客戶經營', '會員', '顧客經營'])) {
    return {
      summary: '顧客互動與關係經營深度不足，代表顧客資料、標籤與回訪節奏還沒有被系統化。',
      risk: '容易讓回購、轉介紹與長期營收變得不穩，也會提高對新客流量的依賴。',
      action: '先建立顧客分級、回訪紀錄與固定關懷節奏。',
    };
  }
  if (includesAny(item, ['廣告', 'CPA', '獲客', '投放'])) {
    return {
      summary: '流量取得成本偏高，表示素材、受眾、服務頁或成交承接流程需要重新檢視。',
      risk: '若直接加碼預算，可能只是放大浪費，讓每一位成交客的取得成本持續升高。',
      action: '先比對 CPA、客單價與 ROAS，找出是素材、受眾還是成交流程造成流失。',
    };
  }
  if (includesAny(item, ['金流', '手續費', '平台'])) {
    return {
      summary: '非現金收款成本正在侵蝕淨利，若沒有定期追蹤，很容易變成隱形流失。',
      risk: '交易量越大，手續費累積越高，會直接壓縮年度實際留下來的利潤。',
      action: '先檢視支付工具、平台費率與非現金收款比例，確認是否需要調整收款結構。',
    };
  }
  if (includesAny(item, ['社群', '內容', '流量', '曝光'])) {
    return {
      summary: '自然流量與內容承接仍不穩定，代表目前曝光來源還沒有形成可預期的節奏。',
      risk: '若沒有固定內容資產，未來會更依賴廣告、活動或熟客介紹。',
      action: '先建立每週固定內容節奏，累積服務案例、顧客見證與預約入口。',
    };
  }
  if (includesAny(item, ['無明顯', '目前無'])) {
    return {
      summary: '目前沒有明顯單一風險，但仍需要持續追蹤獲利、回流與金流成本。',
      risk: '若沒有固定檢查節奏，問題可能在成長後才一次浮現。',
      action: '先設定每月固定追蹤毛利率、淨利率、回流率與金流手續費率。',
    };
  }
  return {
    summary: '這項問題會影響獲利穩定度，建議先釐清它與營收、成本、顧客回流之間的關係。',
    risk: '若沒有轉成可追蹤指標，容易一直知道問題，卻沒有真正改善。',
    action: '先設定一個 30 天內可以追蹤的改善指標，並安排第一個執行動作。',
  };
}

function problemConsultantText(problem, index) {
  return problemAdvice(problem, index).summary;
}

function strengthAdvice(strength, index = 0) {
  const item = String(strength || '');
  if (includesAny(item, ['毛利'])) {
    return {
      summary: '代表目前定價與直接成本控制具備基礎，服務本身有留下毛利的能力。',
      leverage: '可優先放大高價值服務、套票或療程組合，讓毛利優勢轉成更穩定的營收。',
      action: '先整理毛利最高的 3 個服務項目，設計加購、套票或升級方案。',
    };
  }
  if (includesAny(item, ['淨利'])) {
    return {
      summary: '代表實際留下的利潤狀態相對健康，具備再投入會員經營、內容與團隊分工的空間。',
      leverage: '可將多出來的利潤投入在回流、內容或流程優化，讓獲利不只停留在當下。',
      action: '先決定一筆固定預算，投入會員回訪或高價值顧客經營。',
    };
  }
  if (includesAny(item, ['介紹', '口碑', '轉介紹'])) {
    return {
      summary: '代表顧客信任度與服務滿意度具備基礎，已經有自然口碑的種子。',
      leverage: '可設計轉介紹獎勵、顧客見證與案例內容，讓口碑變成可複製的流程。',
      action: '先整理近期滿意顧客名單，設計一個低門檻轉介紹邀請。',
    };
  }
  if (includesAny(item, ['回流', '老客', '再訪'])) {
    return {
      summary: '代表顧客願意再次消費，這是美業最重要的穩定獲利基礎。',
      leverage: '可進一步設計會員分級、週期提醒與再購方案，提高顧客終身價值。',
      action: '先把老客依最近消費時間分組，建立固定回訪節奏。',
    };
  }
  if (includesAny(item, ['客單', '高單價'])) {
    return {
      summary: '代表服務價值與消費承接能力不錯，顧客願意為更高價值的方案付費。',
      leverage: '可持續優化高價值方案、加購設計與療程組合，提高單次消費效率。',
      action: '先檢查目前最高客單組合，整理成標準銷售話術與頁面呈現。',
    };
  }
  if (includesAny(item, ['社群', '內容', '流量'])) {
    return {
      summary: '代表目前已具備自然曝光基礎，內容有機會成為穩定獲客入口。',
      leverage: '可把內容轉成預約入口、顧客案例與服務教育資產，降低長期獲客成本。',
      action: '先選出互動最高的 5 篇內容，延伸成預約導向的系列貼文。',
    };
  }
  if (includesAny(item, ['廣告', 'ROAS', '轉換'])) {
    return {
      summary: '代表投放或成交承接已有基礎，能將流量轉成營收。',
      leverage: '可把有效素材、受眾與成交流程標準化，避免每次重新摸索。',
      action: '先整理目前最高 ROAS 的素材與受眾，建立廣告素材清單。',
    };
  }
  if (includesAny(item, ['無明顯', '目前無'])) {
    return {
      summary: '目前沒有足夠明確的優勢訊號，代表需要先建立可追蹤的正向指標。',
      leverage: '可先從毛利、回流、介紹與內容穩定度中，選一個最容易形成優勢的項目。',
      action: '先設定 30 天內最想放大的單一指標，避免同時分散在太多方向。',
    };
  }
  return {
    summary: '這項優勢是下一階段成長支點，建議把它標準化，讓它不只依賴個人經驗。',
    leverage: '可轉成流程、話術、內容或會員制度，形成可複製的經營資產。',
    action: '先定義這項優勢背後的成功做法，並整理成可重複執行的流程。',
  };
}

function strengthConsultantText(strength, index) {
  return strengthAdvice(strength, index).summary;
}

function scoreByHigher(value, poor, caution, good, excellent) {
  const n = safeNumber(value);
  if (n >= excellent) return Math.min(100, 92 + (n - excellent) * 0.5);
  if (n >= good) return 75 + ((n - good) / (excellent - good)) * 17;
  if (n >= caution) return 50 + ((n - caution) / (good - caution)) * 25;
  if (n >= poor) return 25 + ((n - poor) / (caution - poor)) * 25;
  return Math.max(0, (n / Math.max(poor, 1)) * 25);
}

function scoreByLower(value, excellent, good, caution, weak) {
  const n = safeNumber(value);
  if (n <= excellent) return 95;
  if (n <= good) return 75 + ((good - n) / (good - excellent)) * 20;
  if (n <= caution) return 50 + ((caution - n) / (caution - good)) * 25;
  if (n <= weak) return 25 + ((weak - n) / (weak - caution)) * 25;
  return Math.max(0, 25 - (n - weak) / Math.max(weak, 1) * 20);
}

function scoreToStage(score) {
  const s = safeNumber(score);
  if (s >= 85) return '擴張期';
  if (s >= 70) return '優化期';
  if (s >= 55) return '建構期';
  if (s >= 40) return '修復期';
  return '重整期';
}

function scoreToSummary(score) {
  const s = safeNumber(score);
  if (s >= 85) return '獲利體質已相對成熟，下一步可放大會員經營、團隊分工與流量規模。';
  if (s >= 70) return '經營模式逐漸穩定，下一步建議優化回流、轉換效率與內容承接系統。';
  if (s >= 55) return '目前已具備成長條件，但仍需要建立更穩定的獲利、回流與顧客經營系統。';
  if (s >= 40) return '目前營運已有基礎，但獲利或回流結構仍需先修復，避免越成長越吃力。';
  return '目前營運風險偏高，建議先回到核心數據，優先處理獲利、成本與客戶回流問題。';
}

function scoreToGrade(score) {
  const s = safeNumber(score);
  if (s >= 85) return '優秀';
  if (s >= 70) return '良好';
  if (s >= 55) return '中等';
  if (s >= 40) return '待修復';
  return '高風險';
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
  const [isBlueprintUnlocked, setIsBlueprintUnlocked] = useState(false);
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

  const sheetOverallScore = safeNumber(pick(data.newOverallScore, data.raw?.B50, data.overallScore, data.growthStageScore, data['新版綜合分數'], data['成長階段綜合分數']));

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

  const metricScores = useMemo(() => {
    const grossScore = scoreByHigher(grossMargin, 40, 60, 70, 80);
    const netScore = scoreByHigher(netMargin, -5, 5, 15, 25);
    const feeScore = scoreByLower(paymentFeeRate, 1.5, 3, 5, 8);
    const returnScore = scoreByHigher(returningRate, 5, 15, 25, 40);
    const referralScore = scoreByHigher(referralRate, 5, 15, 25, 40);
    const customerPowerScore = Math.max(0, Math.min(100, customerPower * 10));
    const trafficScore = Math.round((socialScore + contentScore + digitalScore) / 3);
    const roasScore = scoreByHigher(roas, 1, 3, 5, 8);
    const cpaScore = cpa > 0 ? scoreByLower(cpa, 800, 1600, 2800, 4200) : 30;
    const profit = Math.round(grossScore * 0.45 + netScore * 0.45 + feeScore * 0.10);
    const customer = Math.round(returnScore * 0.45 + referralScore * 0.25 + customerPowerScore * 0.30);
    const conversion = Math.round(roasScore * 0.45 + cpaScore * 0.35 + feeScore * 0.20);
    const brand = Math.round(digitalScore || trafficScore || 0);
    const overall = Math.round(profit * 0.40 + customer * 0.25 + trafficScore * 0.15 + conversion * 0.10 + brand * 0.10);
    return { profit, customer, traffic: trafficScore, conversion, brand, overall };
  }, [grossMargin, netMargin, paymentFeeRate, returningRate, referralRate, customerPower, socialScore, contentScore, digitalScore, roas, cpa]);

  const overallScore = metricScores.overall || sheetOverallScore;
  const growthStage = scoreToStage(overallScore);
  const heroSummary = scoreToSummary(overallScore);
  const overviewInsightList = overviewFindings({
    profitGrade,
    netGrade,
    returnGrade,
    avgTicketGrade,
    feeGrade,
    grossMargin,
    netMargin,
    returningRate,
    avgTicket,
    paymentFeeRate,
  });

  const handleUnlockBlueprint = (event) => {
    event.preventDefault();
    setIsBlueprintUnlocked(true);
    setTimeout(() => {
      document.getElementById('pfm-blueprint-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleExportPdf = () => {
    setIsBlueprintUnlocked(true);
    setTimeout(() => {
      document.body.classList.add('pfm-v21-print-mode');
      window.print();
      setTimeout(() => document.body.classList.remove('pfm-v21-print-mode'), 400);
    }, 120);
  };

  const radarScores = useMemo(() => ({
    profit: metricScores.profit,
    customer: metricScores.customer,
    traffic: metricScores.traffic,
    conversion: metricScores.conversion,
    brand: metricScores.brand,
  }), [metricScores]);

  return (
    <main className="pfm-v17-result-page">
      <section className="pfm-v17-hero-card">
        <div className="pfm-v17-hero-copy">
          <p className="pfm-v17-eyebrow">PFM 美業獲利健檢結果</p>
          <h1>{storeName}｜經營診斷結果</h1>
          <p>{heroSummary}</p>
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

      <section className="pfm-v21-consultant-summary" aria-label="PFM 顧問摘要">
        <div>
          <span>目前階段</span>
          <strong>{growthStage}</strong>
          <p>{heroSummary}</p>
        </div>
        <div>
          <span>最大風險</span>
          <strong>{problem1}</strong>
          <p>{problemConsultantText(problem1, 0)}</p>
        </div>
        <div>
          <span>最大優勢</span>
          <strong>{strength1}</strong>
          <p>{strengthConsultantText(strength1, 0)}</p>
        </div>
        <div>
          <span>90天優先</span>
          <strong>{firstPriority}</strong>
          <p>先聚焦一個最能影響獲利與回流的改善動作，避免一次處理太多方向。</p>
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
        <div className="pfm-v18-overview-findings">
          <h4>PFM 顧問解讀</h4>
          <ul>
            {overviewInsightList.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </Section>

      <section className="pfm-v17-two-col">
        <div className="pfm-v17-list-card is-problem">
          <span className="pfm-v17-status-dot" />
          <h2>目前最需要處理的三件事</h2>
          <p>優先看會影響獲利、回流與成長速度的關鍵問題。</p>
          {[problem1, problem2, problem3].map((item, index) => {
            const advice = problemAdvice(item, index);
            return (
              <div className="pfm-v17-list-item pfm-v21-advice-item" key={`${item}-${index}`}>
                <b>{index + 1}</b>
                <div>
                  <strong>{item}</strong>
                  <p>{advice.summary}</p>
                  <div className="pfm-v21-advice-line"><em>⚠ 風險：</em><span>{advice.risk}</span></div>
                  <div className="pfm-v21-advice-line"><em>✓ 建議第一步：</em><span>{advice.action}</span></div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="pfm-v17-list-card is-strength">
          <span className="pfm-v17-status-dot" />
          <h2>目前最值得放大的三個優勢</h2>
          <p>不是只找問題，也要看見你已經做對的地方。</p>
          {[strength1, strength2, strength3].map((item, index) => {
            const advice = strengthAdvice(item, index);
            return (
              <div className="pfm-v17-list-item pfm-v21-advice-item" key={`${item}-${index}`}>
                <b>{index + 1}</b>
                <div>
                  <strong>{item}</strong>
                  <p>{advice.summary}</p>
                  <div className="pfm-v21-advice-line"><em>↗ 放大方向：</em><span>{advice.leverage}</span></div>
                  <div className="pfm-v21-advice-line"><em>✓ 建議第一步：</em><span>{advice.action}</span></div>
                </div>
              </div>
            );
          })}
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

      <section className="pfm-v18-unlock-card" id="pfm-blueprint-unlock">
        <p className="pfm-v17-eyebrow">免費解鎖</p>
        <h2>店家成長藍圖已產生</h2>
        <p>看懂結果只是開始。點擊下方按鈕後，可直接查看你的獲利結構、客戶經營、流量內容能力、成長瓶頸與 90 天顧問建議。</p>
        <div className="pfm-v18-unlock-points" aria-label="解鎖內容">
          <span>獲利結構分析</span>
          <span>客戶經營分析</span>
          <span>流量內容能力</span>
          <span>廣告效率評估</span>
          <span>成長潛力藍圖</span>
          <span>90天改善路徑</span>
        </div>
        {!isBlueprintUnlocked ? (
          <form className="pfm-v18-unlock-form is-button-only" onSubmit={handleUnlockBlueprint}>
            <button type="submit">免費解鎖完整報告</button>
          </form>
        ) : (
          <div className="pfm-v18-unlocked-note">已解鎖完整成長藍圖，請往下查看完整章節。</div>
        )}
        {onRestart && <button className="pfm-v18-restart-link" type="button" onClick={onRestart}>重新健檢</button>}
      </section>

      {isBlueprintUnlocked && (
        <>
      <section className="pfm-v17-blueprint-nav" id="pfm-blueprint-start">
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
            <div className="pfm-v17-radar-grade"><span>綜合評級</span><strong>{scoreToGrade(overallScore)}</strong><p>目前最大優勢為「{strength1}」，可作為下一階段成長槓桿。</p></div>
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

      <div className="pfm-v18-pdf-actions">
        <button type="button" onClick={handleExportPdf}>列印 / 另存 PDF 報告</button>
      </div>

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
        </>
      )}

      <section className="pfm-v21-pdf-report" aria-hidden="true">
        <article className="pfm-v21-pdf-page is-cover">
          <p className="pfm-v21-pdf-brand">PFM｜Profit Flow Management</p>
          <h1>美業獲利健檢<br />專屬經營診斷報告</h1>
          <div className="pfm-v21-pdf-cover-box">
            <p><span>店家名稱</span><strong>{storeName}</strong></p>
            <p><span>店家類型</span><strong>{storeType}｜{category}</strong></p>
            <p><span>報告日期</span><strong>{new Date().toLocaleDateString('zh-TW')}</strong></p>
          </div>
          <footer>PFM Profit Flow Management</footer>
        </article>

        <article className="pfm-v21-pdf-page">
          <header><span>01</span><h2>經營總覽</h2></header>
          <div className="pfm-v21-pdf-grid two">
            <div><small>成長階段</small><strong>{growthStage}</strong></div>
            <div><small>綜合分數</small><strong>{fmtNumber(overallScore, 2)}</strong></div>
            <div><small>最大風險</small><strong>{problem1}</strong></div>
            <div><small>90天優先</small><strong>{firstPriority}</strong></div>
          </div>
          <section className="pfm-v21-pdf-insight"><h3>PFM 顧問摘要</h3><p>{heroSummary}</p><p>目前最大優勢為「{strength1}」，最大需要修復的項目為「{problem1}」。建議先把 90 天焦點收斂在「{firstPriority}」。</p></section>
          <footer>PFM Profit Flow Management</footer>
        </article>

        <article className="pfm-v21-pdf-page">
          <header><span>02</span><h2>獲利健康總覽</h2></header>
          <div className="pfm-v21-pdf-grid four">
            <div><small>毛利率</small><strong>{fmtPercent(grossMargin)}</strong></div>
            <div><small>淨利率</small><strong>{fmtPercent(netMargin)}</strong></div>
            <div><small>回流率</small><strong>{fmtPercent(returningRate)}</strong></div>
            <div><small>客單價</small><strong>{fmtMoney(avgTicket)}</strong></div>
          </div>
          <section className="pfm-v21-pdf-insight"><h3>PFM 顧問解讀</h3><ul>{overviewInsightList.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <footer>PFM Profit Flow Management</footer>
        </article>

        <article className="pfm-v21-pdf-page">
          <header><span>03</span><h2>客戶經營分析</h2></header>
          <div className="pfm-v21-pdf-grid four">
            <div><small>新客率</small><strong>{fmtPercent(newCustomerRate)}</strong></div>
            <div><small>回流率</small><strong>{fmtPercent(returningRate)}</strong></div>
            <div><small>介紹客比例</small><strong>{fmtPercent(referralRate)}</strong></div>
            <div><small>客戶經營力</small><strong>{fmtNumber(customerPower, 2)} / 10</strong></div>
          </div>
          <section className="pfm-v21-pdf-insight"><h3>PFM 顧問解讀</h3><p>客戶經營的重點不是只有新客，而是顧客是否願意再次回來、願意介紹，並能被系統化經營。</p><p>若回流率偏低，建議優先建立回訪提醒、會員標籤與固定再購流程。</p></section>
          <footer>PFM Profit Flow Management</footer>
        </article>

        <article className="pfm-v21-pdf-page">
          <header><span>04</span><h2>流量內容能力</h2></header>
          <div className="pfm-v21-pdf-grid four">
            <div><small>社群經營度</small><strong>{fmtNumber(socialScore, 2)}</strong></div>
            <div><small>內容執行力</small><strong>{fmtNumber(contentScore, 2)}</strong></div>
            <div><small>數位成熟度</small><strong>{fmtNumber(digitalScore, 2)}</strong></div>
            <div><small>數位成熟評級</small><strong>{digitalGrade}</strong></div>
          </div>
          <section className="pfm-v21-pdf-insight"><h3>PFM 顧問解讀</h3><p>流量與內容能力會影響未來獲客穩定度。若數位成熟度偏弱，建議先建立固定內容節奏，再進一步放大廣告投放。</p></section>
          <footer>PFM Profit Flow Management</footer>
        </article>

        <article className="pfm-v21-pdf-page">
          <header><span>05</span><h2>轉換漏斗與廣告效率</h2></header>
          <div className="pfm-v21-pdf-grid three">
            <div><small>CPA</small><strong>{fmtNumber(cpa, 0)}</strong></div>
            <div><small>ROAS</small><strong>{fmtNumber(roas, 2)}</strong></div>
            <div><small>金流手續費率</small><strong>{fmtPercent(paymentFeeRate)}</strong></div>
          </div>
          <section className="pfm-v21-pdf-insight"><h3>PFM 顧問解讀</h3><p>廣告效率不是只看有沒有投放，而是看流量進來後能否被預約、成交與回流承接。</p><p>若 ROAS 表現好但淨利偏低，仍要同步檢查成本結構與金流費用。</p></section>
          <footer>PFM Profit Flow Management</footer>
        </article>

        <article className="pfm-v21-pdf-page">
          <header><span>06</span><h2>三大問題診斷</h2></header>
          <div className="pfm-v21-pdf-list">
            {[problem1, problem2, problem3].map((item, index) => { const advice = problemAdvice(item, index); return <section key={`${item}-pdf-${index}`}><b>{index + 1}</b><div><h3>{item}</h3><p>{advice.summary}</p><p><strong>風險：</strong>{advice.risk}</p><p><strong>建議第一步：</strong>{advice.action}</p></div></section>; })}
          </div>
          <footer>PFM Profit Flow Management</footer>
        </article>

        <article className="pfm-v21-pdf-page">
          <header><span>07</span><h2>三大優勢放大</h2></header>
          <div className="pfm-v21-pdf-list">
            {[strength1, strength2, strength3].map((item, index) => { const advice = strengthAdvice(item, index); return <section key={`${item}-pdf-${index}`}><b>{index + 1}</b><div><h3>{item}</h3><p>{advice.summary}</p><p><strong>放大方向：</strong>{advice.leverage}</p><p><strong>建議第一步：</strong>{advice.action}</p></div></section>; })}
          </div>
          <footer>PFM Profit Flow Management</footer>
        </article>

        <article className="pfm-v21-pdf-page">
          <header><span>08</span><h2>成長潛力藍圖</h2></header>
          <div className="pfm-v21-pdf-grid two">
            <div><small>獲利能力</small><strong>{fmtNumber(radarScores.profit, 0)}</strong></div>
            <div><small>客戶經營</small><strong>{fmtNumber(radarScores.customer, 0)}</strong></div>
            <div><small>流量能力</small><strong>{fmtNumber(radarScores.traffic, 0)}</strong></div>
            <div><small>轉換能力</small><strong>{fmtNumber(radarScores.conversion, 0)}</strong></div>
          </div>
          <section className="pfm-v21-pdf-insight"><h3>PFM 顧問解讀</h3><p>雷達圖用來快速看見短板。後續 V22 會同步重建 Google Sheet 評分引擎，讓分數、雷達圖與成長階段完全一致。</p></section>
          <footer>PFM Profit Flow Management</footer>
        </article>

        <article className="pfm-v21-pdf-page">
          <header><span>09</span><h2>90天改善路徑</h2></header>
          <div className="pfm-v21-pdf-roadmap"><section><b>1</b><h3>{firstPriority}</h3><p>先處理最能影響獲利與回流的第一優先事項。</p></section><section><b>2</b><h3>優化金流與廣告成本</h3><p>降低隱形成本，提升每一筆成交留下來的淨利。</p></section><section><b>3</b><h3>建立會員經營系統</h3><p>用標籤、回訪與再購流程提升顧客終身價值。</p></section></div>
          <section className="pfm-v21-pdf-final"><h3>顧問結論</h3><p>{consultantDirection}</p></section>
          <footer>PFM Profit Flow Management</footer>
        </article>
      </section>
    </main>
  );
}
