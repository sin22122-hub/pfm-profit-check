import React, { useEffect, useMemo, useState } from 'react';
import html2pdf from 'html2pdf.js';

const BOOKING_URL = '';
const STORAGE_KEY = 'pfm_latest_result_payload_v15';

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

  if (level === '卓越') return `每投入 1 元廣告費，可創造約 ${value} 元營收。廣告效率非常卓越，目前廣告不是主要瓶頸，下一步應優先檢查回流率、客單價與服務產能。`;
  if (level === '優秀') return `每投入 1 元廣告費，可創造約 ${value} 元營收。廣告效率表現優秀，可持續優化素材與受眾，同時強化會員經營與回流機制。`;
  if (level === '良好') return `每投入 1 元廣告費，可創造約 ${value} 元營收。廣告效率良好，建議持續測試素材，並提升預約與成交轉換率。`;
  if (level === '普通') return `每投入 1 元廣告費，可創造約 ${value} 元營收。廣告效率普通，建議檢查廣告內容、受眾設定與預約流程。`;

  return `每投入 1 元廣告費，只創造約 ${value} 元營收。廣告效率偏低，建議優先檢查廣告素材、受眾設定與成交流程。`;
};

const getRateLevel = (value, good = 60, warn = 35) => {
  const number = toNumber(value);
  if (number >= good) return '優秀';
  if (number >= warn) return '良好';
  if (number > 0) return '待改善';
  return '-';
};

const getCostLevel = (value, goodMax = 3, warnMax = 6) => {
  const number = toNumber(value);
  if (number <= goodMax) return '良好';
  if (number <= warnMax) return '注意';
  return '偏高';
};

const getStars = (level) => {
  if (['卓越', '優秀', '極高', '高'].includes(level)) return '★★★★★';
  if (['良好', '健康', '成長期', '擴張期'].includes(level)) return '★★★★☆';
  if (['普通', '穩定', '中', '穩定期'].includes(level)) return '★★★☆☆';
  if (['待改善', '需改善', '偏高', '偏低', '偏弱'].includes(level)) return '★★☆☆☆';
  return '★★★☆☆';
};

const MetricCard = ({ icon, label, value, level, sub, tone }) => {
  const finalTone = tone || statusTone(level);

  return (
    <article className={`pfm-v15-card pfm-v15-metric ${finalTone ? `tone-${finalTone}` : ''}`}>
      <div className="pfm-v15-card-top">
        {icon && <span className="pfm-v15-icon" aria-hidden="true">{icon}</span>}
        <div>
          <p>{label}</p>
          {level && <em>{level}</em>}
        </div>
      </div>
      <strong>{display(value)}</strong>
      {sub && <small>{sub}</small>}
    </article>
  );
};

const Chapter = ({ number, icon, title, intro, children, className = '' }) => (
  <section className={`pfm-v15-section ${className}`}>
    <div className="pfm-v15-section-head">
      <div className="pfm-v15-chapter-mark">
        {icon && <span aria-hidden="true">{icon}</span>}
        {number && <small>第{number}章</small>}
      </div>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
    {children}
  </section>
);

const RankCards = ({ items = [], type = 'problem' }) => (
  <div className={`pfm-v15-rank-list ${type}`}>
    {items.map((item, index) => (
      <article className="pfm-v15-rank-card" key={`${type}-${item}-${index}`}>
        <span>{index + 1}</span>
        <div>
          <strong>{display(item)}</strong>
          <p>{type === 'problem' ? '優先處理，避免持續影響獲利與成長。' : '建議放大，成為下一階段成長支點。'}</p>
        </div>
      </article>
    ))}
  </div>
);

const StepCards = ({ items = [] }) => {
  const fallback = ['建立回流機制', '優化金流與廣告成本', '建立會員經營流程'];
  const goals = ['讓回流率往 35% 以上提升', '降低隱形成本與無效投放', '提升客戶終身價值與穩定營收'];
  const tones = ['danger', 'warn', 'good'];

  const list = (items.length ? items : fallback).slice(0, 3);

  return (
    <div className="pfm-v15-roadmap">
      {list.map((item, index) => (
        <article className={`pfm-v15-roadmap-step ${tones[index] || 'warn'}`} key={`${item}-${index}`}>
          <div className="pfm-v15-step-number">{index + 1}</div>
          <div>
            <small>STEP {index + 1}</small>
            <h3>{display(item)}</h3>
            <p>{goals[index]}</p>
          </div>
        </article>
      ))}
    </div>
  );
};

const FindingBox = ({ title, children }) => (
  <div className="pfm-v15-finding">
    <strong>{title}</strong>
    <p>{children}</p>
  </div>
);

function RadarChart({ result }) {
  const labels = ['獲利能力', '客戶經營', '流量能力', '成交能力', '品牌成熟'];
  const values = [
    Math.min(toNumber(result.grossMargin), 100),
    Math.min(toNumber(result.customerScore) * 10, 100),
    Math.min(toNumber(result.socialScore), 100),
    Math.min(toNumber(result.roas) * 8, 100),
    Math.min(toNumber(result.digitalScore), 100),
  ];

  const center = 140;
  const maxRadius = 92;
  const angleOffset = -90;

  const pointFor = (index, radius) => {
    const angle = ((angleOffset + index * 72) * Math.PI) / 180;
    return [center + Math.cos(angle) * radius, center + Math.sin(angle) * radius];
  };

  const points = values.map((value, index) => pointFor(index, (value / 100) * maxRadius).join(',')).join(' ');

  const grid = [0.25, 0.5, 0.75, 1].map((ratio) => {
    const poly = [0, 1, 2, 3, 4].map((index) => pointFor(index, ratio * maxRadius).join(',')).join(' ');
    return <polygon key={ratio} points={poly} className="pfm-v15-radar-grid" />;
  });

  return (
    <div className="pfm-v15-radar-card">
      <svg viewBox="0 0 280 280" className="pfm-v15-radar-svg" aria-hidden="true">
        {grid}
        {[0, 1, 2, 3, 4].map((index) => {
          const [x, y] = pointFor(index, maxRadius);
          return <line key={index} x1={center} y1={center} x2={x} y2={y} className="pfm-v15-radar-axis" />;
        })}
        <polygon points={points} className="pfm-v15-radar-area" />
        <polygon points={points} className="pfm-v15-radar-line" />
      </svg>
      <div className="pfm-v15-radar-label top">{labels[0]}</div>
      <div className="pfm-v15-radar-label right-top">{labels[1]}</div>
      <div className="pfm-v15-radar-label right-bottom">{labels[2]}</div>
      <div className="pfm-v15-radar-label left-bottom">{labels[3]}</div>
      <div className="pfm-v15-radar-label left-top">{labels[4]}</div>
    </div>
  );
}

export default function ResultDashboard({ result, formData = {}, onRestart }) {
  const savedPayload = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch {
      return null;
    }
  }, []);

  const effectiveResult = result || savedPayload?.result || null;
  const effectiveFormData = result ? formData : (savedPayload?.formData || formData || {});

  const [unlocked, setUnlocked] = useState(Boolean(savedPayload?.unlocked));
  const [email, setEmail] = useState(savedPayload?.email || '');

  useEffect(() => {
    if (!effectiveResult) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        result: effectiveResult,
        formData: effectiveFormData,
        unlocked,
        email,
      })
    );
  }, [effectiveResult, effectiveFormData, unlocked, email]);

  if (!effectiveResult) return null;

  const problems = [effectiveResult.problem1, effectiveResult.problem2, effectiveResult.problem3].filter(Boolean);
  const strengths = [effectiveResult.strength1, effectiveResult.strength2, effectiveResult.strength3].filter(Boolean);
  const actions = [effectiveResult.priority1, effectiveResult.priority2, effectiveResult.priority3].filter(Boolean);
  const roasLevel = getRoasLevel(effectiveResult.roas);
  const roasInsight = getRoasInsight(effectiveResult.roas);
  const growthLevel = display(effectiveResult.growthPotentialLevel, '待改善');

  const grossLevel = getRateLevel(effectiveResult.grossMargin, 70, 55);
  const netLevel = getRateLevel(effectiveResult.netMargin, 25, 15);
  const returnLevel = getRateLevel(effectiveResult.returnRate, 40, 25);
  const paymentLevel = getCostLevel(effectiveResult.paymentFeeRate, 2.5, 4);

  const downloadPDF = () => {
    const element = document.getElementById('growth-blueprint');

    if (!element) {
      alert('請先解鎖店家成長藍圖後，再下載 PDF 診斷報告。');
      return;
    }

    document.body.classList.add('pdf-exporting');

    const options = {
      margin: [8, 8, 8, 8],
      filename: `PFM美業獲利健檢_${display(effectiveFormData.storeName, '店家')}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#F7F3EC',
        windowWidth: 1280,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
      },
    };

    html2pdf()
      .set(options)
      .from(element)
      .save()
      .finally(() => {
        document.body.classList.remove('pdf-exporting');
      });
  };

  const unlockBlueprint = () => {
    setUnlocked(true);
    setTimeout(() => {
      document.getElementById('growth-blueprint')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 80);
  };

  const restart = () => {
    localStorage.removeItem(STORAGE_KEY);
    onRestart?.();
  };

  return (
    <main id="pfm-report" className="pfm-result-page pfm-v15-report">
      <section className="pfm-v15-cover">
        <div className="pfm-v15-cover-copy">
          <p className="pfm-v15-eyebrow">PFM 美業獲利健檢結果</p>
          <h1>{display(effectiveFormData.storeName, '你的店家')}｜經營診斷結果</h1>
          <p>{display(effectiveResult.stageComment)}</p>

          <div className="pfm-v15-tags">
            <span>{display(effectiveResult.businessType || effectiveFormData.businessType)}</span>
            <span>{Array.isArray(effectiveFormData.storeType) ? effectiveFormData.storeType.join('、') : display(effectiveFormData.storeType)}</span>
            <span>{display(effectiveFormData.month, '本期資料')}</span>
          </div>
        </div>

        <div className="pfm-v15-score-panel">
          <span>店家成長階段</span>
          <strong>{display(effectiveResult.growthStage)}</strong>
          <div>{display(effectiveResult.growthScore)}</div>
          <p>綜合分數</p>
        </div>
      </section>

      <Chapter title="獲利健康度總覽" intro="先看最直接影響獲利與經營穩定度的核心指標。">
        <div className="pfm-v15-metric-grid five">
          <MetricCard icon="💰" label="毛利率" value={effectiveResult.grossMargin} level={grossLevel} sub="代表服務定價與成本控制能力。" />
          <MetricCard icon="📈" label="淨利率" value={effectiveResult.netMargin} level={netLevel} sub="真正留下來的獲利能力。" />
          <MetricCard icon="🔄" label="回流率" value={effectiveResult.returnRate} level={returnLevel} sub="客戶是否願意再次回來消費。" />
          <MetricCard icon="💳" label="客單價" value={money(effectiveResult.averageOrderValue)} level="良好" sub="單次消費金額與服務價值。" />
          <MetricCard icon="🏦" label="金流手續費率" value={effectiveResult.paymentFeeRate} level={paymentLevel} sub="隱形成本是否正在侵蝕淨利。" />
        </div>
      </Chapter>

      <div className="pfm-v15-split-grid">
        <Chapter icon="🔴" title="目前最需要處理的三件事" intro="優先看會影響獲利、回流與成長速度的關鍵問題。">
          <RankCards items={problems} type="problem" />
        </Chapter>

        <Chapter icon="🟢" title="目前最值得放大的三個優勢" intro="不是只找問題，也要看見你已經做對的地方。">
          <RankCards items={strengths} type="strength" />
        </Chapter>
      </div>

      <section className="pfm-v15-hidden-cost">
        <div>
          <p className="pfm-v15-eyebrow">⚠ 隱形成本提醒</p>
          <h2>金流手續費正在持續吃掉你的淨利</h2>
          <p>{display(effectiveResult.hiddenCostWarning)}</p>
        </div>

        <div className="pfm-v15-hidden-number">
          <span>本期金流手續費率</span>
          <strong>{display(effectiveResult.paymentFeeRate)}</strong>
          <p>若維持目前規模，這類費用會持續累積成年度獲利流失。</p>
        </div>
      </section>

      <section className="pfm-v15-blueprint-nav">
        <p className="pfm-v15-eyebrow">店家成長藍圖</p>
        <h2>從「知道問題」進入「理解原因」</h2>
        <p>以下內容將目前健檢數據整理成顧問視角，協助你看見獲利、客戶、流量與下一步改善方向。</p>
        <div className="pfm-v15-nav-grid">
          <span>💰 獲利結構</span>
          <span>👥 客戶經營</span>
          <span>📣 流量內容</span>
          <span>🎯 廣告效率</span>
          <span>⭐ 成長潛力</span>
          <span>🚀 90天改善</span>
        </div>
      </section>

      {!unlocked && (
        <section className="pfm-v15-unlock no-print">
          <p className="pfm-v15-eyebrow">免費解鎖</p>
          <h2>完整店家成長藍圖已產生</h2>
          <p>解鎖後可查看第一章至第七章的完整顧問報告，包含轉換漏斗、成長潛力雷達圖與90天改善路徑。</p>
          <div className="pfm-v15-email-row">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="輸入 Email 免費解鎖"
            />
            <button className="btn" onClick={unlockBlueprint}>
              免費解鎖完整報告
            </button>
          </div>
        </section>
      )}

      {unlocked && (
        <section id="growth-blueprint" className="pfm-v15-blueprint">
          <div className="pdf-action-bar no-print">
            <button className="btn" onClick={downloadPDF}>
              下載 PDF 診斷報告
            </button>
          </div>

          <Chapter number="一" icon="💰" title="獲利結構分析" intro="獲利不是只看營收，而是看毛利、淨利與成本是否能留下錢。">
            <div className="pfm-v15-metric-grid auto">
              <MetricCard icon="💵" label="本月營收" value={money(effectiveResult.totalRevenue)} />
              <MetricCard icon="📈" label="毛利率" value={effectiveResult.grossMargin} level={grossLevel} />
              <MetricCard icon="💎" label="淨利率" value={effectiveResult.netMargin} level={netLevel} />
              <MetricCard icon="👤" label="人事成本率" value={effectiveResult.hrCostRate} />
              <MetricCard icon="🏢" label="租金率" value={effectiveResult.rentRate} />
              <MetricCard icon="📣" label="廣告率" value={effectiveResult.adRate} />
              <MetricCard icon="💳" label="金流手續費率" value={effectiveResult.paymentFeeRate} level={paymentLevel} />
            </div>
            <FindingBox title="本章重點發現">
              毛利率與淨利率是獲利能力的核心觀察點；若金流、廣告或固定成本偏高，即使營收不差，也可能讓實際留下來的錢被稀釋。
            </FindingBox>
          </Chapter>

          <Chapter number="二" icon="👥" title="客戶經營分析" intro="回流、新客與介紹客的比例，會決定你是靠穩定經營，還是一直追新客。">
            <div className="pfm-v15-metric-grid four">
              <MetricCard icon="👤" label="新客率" value={effectiveResult.newCustomerRate} />
              <MetricCard icon="🔄" label="回流率" value={effectiveResult.returnRate} level={returnLevel} />
              <MetricCard icon="🤝" label="介紹客比例" value={effectiveResult.referralRate} />
              <MetricCard icon="🏆" label="客戶經營力" value={`${display(effectiveResult.customerScore)} / 10`} level={effectiveResult.customerLevel} />
            </div>
            <FindingBox title="本章重點發現">
              客戶經營的重點不只是新客，而是讓顧客願意再次回來、願意介紹，進一步降低獲客壓力與廣告依賴。
            </FindingBox>
          </Chapter>

          <Chapter number="三" icon="📣" title="流量與內容能力" intro="PFM 不鼓勵盲目投廣告，而是先看目前是否具備自然流量與內容經營基礎。">
            <div className="pfm-v15-metric-grid four">
              <MetricCard icon="📱" label="社群經營度" value={effectiveResult.socialScore} />
              <MetricCard icon="✍️" label="內容執行力" value={effectiveResult.contentScore} />
              <MetricCard icon="🌐" label="數位成熟度" value={effectiveResult.digitalScore} />
              <MetricCard icon="📊" label="數位成熟度評級" value={effectiveResult.digitalLevel} tone={statusTone(effectiveResult.digitalLevel)} />
            </div>
            <FindingBox title="本章重點發現">
              流量與內容能力會影響未來獲客穩定度。若數位成熟度偏弱，建議先建立固定內容節奏，再進一步放大廣告投放。
            </FindingBox>
          </Chapter>

          <Chapter
            number="四"
            icon="🎯"
            title="轉換漏斗與廣告效率"
            intro="流量進來後，有沒有成功變成客戶？CPA 用來看每成交一位客人的廣告成本；ROAS 用來看每 1 元廣告費帶回多少營收。"
            className="pfm-v15-ad-chapter"
          >
            <div className="pfm-v16-funnel-note">
              <strong>轉換路徑</strong>
              <span>曝光</span>
              <b>→</b>
              <span>詢問</span>
              <b>→</b>
              <span>預約</span>
              <b>→</b>
              <span>成交</span>
              <p>目前以 CPA、ROAS 與金流手續費率作為轉換效率的主要代理指標。</p>
            </div>

            <div className="pfm-v15-metric-grid three">
              <MetricCard icon="👤" label="CPA" value={effectiveResult.cpa} sub="每成交一位客人的廣告總成本" />
              <MetricCard icon="📈" label="ROAS" value={effectiveResult.roas} sub="每 1 元廣告成本創造的營收倍數" />
              <MetricCard icon="💳" label="金流手續費率" value={effectiveResult.paymentFeeRate} sub="非現金收款平台成本占營收比例" />
            </div>

            <div className={`pfm-v15-ad-insight tone-${statusTone(roasLevel)}`}>
              <span>廣告效率評級</span>
              <strong>{roasLevel}</strong>
              <em>{getStars(roasLevel)}</em>
              <p>{roasInsight}</p>
            </div>

            <FindingBox title="本章重點發現">
              廣告效率不是只看有沒有投放，而是看流量進來後能否被預約、成交與回流承接。若 ROAS 表現不錯，下一階段應強化會員與回流機制。
            </FindingBox>
          </Chapter>

          <Chapter number="五" icon="⭐" title="成長潛力藍圖" intro="用五個面向快速看見目前店家的經營輪廓與下一步放大方向。">
            <div className="pfm-v15-radar-layout pfm-v16-radar-layout">
              <RadarChart result={effectiveResult} />
              <div className="pfm-v15-radar-summary pfm-v16-radar-summary">
                <p>綜合評級</p>
                <strong>{growthLevel}</strong>
                <em>{getStars(growthLevel)}</em>
                <span>{display(effectiveResult.growthOpportunity)}</span>
              </div>
            </div>

            <div className="pfm-v16-radar-source">
              <article><strong>獲利能力</strong><span>對應第一章：毛利率、淨利率</span></article>
              <article><strong>客戶經營</strong><span>對應第二章：客戶經營力、回流率</span></article>
              <article><strong>流量能力</strong><span>對應第三章：社群經營度、內容執行力</span></article>
              <article><strong>成交能力</strong><span>對應第四章：ROAS、CPA、廣告效率</span></article>
              <article><strong>品牌成熟</strong><span>對應第三章：數位成熟度與經營基礎</span></article>
            </div>
          </Chapter>

          <Chapter number="六" icon="🚀" title="90天優先改善路徑" intro="將目前診斷結果轉換成可執行的三步驟，避免只知道問題，卻不知道下一步要做什麼。">
            <StepCards items={actions} />
          </Chapter>

          <Chapter number="七" icon="🧭" title="顧問診斷結論" className="pfm-v15-final-chapter">
            <div className="pfm-v15-consult-grid">
              <article>
                <h3>目前狀態</h3>
                <p>{display(effectiveResult.currentStatus)}</p>
              </article>
              <article>
                <h3>最大機會</h3>
                <p>{display(effectiveResult.growthOpportunity)}</p>
              </article>
              <article>
                <h3>建議方向</h3>
                <p>{display(effectiveResult.suggestionDirection)}</p>
              </article>
            </div>

            <div className="pfm-v15-cta pfm-v16-cta no-print">
              <h3>你的店並不缺努力，而是缺少一套看得懂數字的經營系統。</h3>
              <p>{display(effectiveResult.nextAction)}</p>
              <a className="btn" href={BOOKING_URL || '#'} target="_blank" rel="noreferrer">
                {display(effectiveResult.bookingText, 'Line｜預約 PFM 一對一診斷')}
              </a>
            </div>
          </Chapter>
        </section>
      )}

      <div className="result-actions-v12 no-print">
        <button className="btn secondary" onClick={restart}>
          重新健檢
        </button>
      </div>
    </main>
  );
}
