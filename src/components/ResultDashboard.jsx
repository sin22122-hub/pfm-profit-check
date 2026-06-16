import React, { useState } from 'react';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters.js';

const MetricCard = ({ label, value }) => (
  <div className="metric-card">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const Section = ({ title, children }) => (
  <section className="report-section">
    <div className="section-title-row"><h2>{title}</h2></div>
    {children}
  </section>
);

const ListBlock = ({ items = [] }) => (
  <div className="rank-list">
    {items.map((item, index) => (
      <div className="rank-item" key={`${item}-${index}`}>
        <span>{index + 1}</span>
        <p>{item}</p>
      </div>
    ))}
  </div>
);

export default function ResultDashboard({ result, onRestart }) {
  const [unlocked, setUnlocked] = useState(false);
  if (!result) return null;

  const {
    basic,
    profitHealth,
    costHealth,
    customerHealth,
    digitalHealth,
    funnelHealth,
    problems,
    strengths,
    actions,
    summary,
    growthStage,
    growthOpportunity,
    cta,
  } = result;

  return (
    <main className="result-page">
      <section className="result-hero">
        <div>
          <p className="eyebrow">PFM 美業獲利健檢報告</p>
          <h1>{basic.storeName || '你的店家'} 獲利成長診斷</h1>
          <p>依據營收、成本、客戶經營與數位能力，產出目前最需要優先檢視的獲利問題與成長機會。</p>
        </div>
        <div className="stage-card">
          <span>店家成長階段</span>
          <strong>{growthStage.stage}</strong>
          <p>{growthStage.description}</p>
        </div>
      </section>

      <Section title="第一區｜店家基本資料">
        <div className="metric-grid four">
          <MetricCard label="店家名稱" value={basic.storeName || '-'} />
          <MetricCard label="店面類型" value={basic.storeType || '-'} />
          <MetricCard label="經營型態" value={basic.businessType || '-'} />
          <MetricCard label="填寫月份" value={basic.month || '-'} />
        </div>
      </Section>

      <Section title="第二區｜獲利健康度">
        <div className="metric-grid five">
          <MetricCard label="本月營收" value={formatCurrency(profitHealth.revenue)} />
          <MetricCard label="毛利率" value={formatPercent(profitHealth.grossMargin)} />
          <MetricCard label="淨利率" value={formatPercent(profitHealth.netMargin)} />
          <MetricCard label="回流率" value={formatPercent(profitHealth.returningRate)} />
          <MetricCard label="客單價" value={formatCurrency(profitHealth.averageTicket)} />
        </div>
      </Section>

      <div className="report-two-col">
        <Section title="第六區｜你的三大問題"><ListBlock items={problems} /></Section>
        <Section title="第七區｜你的三大優勢"><ListBlock items={strengths} /></Section>
      </div>

      <Section title="第八區｜建議改善順序"><ListBlock items={actions} /></Section>

      {!unlocked && (
        <section className="unlock-cta">
          <h2>完整報告已產生</h2>
          <p>解鎖後可查看成本健康度、客戶經營力、流量內容能力、轉換漏斗、總結診斷與獲利成長機會分析。</p>
          <button className="btn" onClick={() => setUnlocked(true)}>解鎖完整報告</button>
        </section>
      )}

      {unlocked && (
        <>
          <Section title="第三區｜成本健康度">
            <div className="metric-grid five">
              <MetricCard label="毛利率評估" value={costHealth.grossMarginStatus} />
              <MetricCard label="人事成本率評估" value={costHealth.hrCostStatus} />
              <MetricCard label="租金率評估" value={costHealth.rentStatus} />
              <MetricCard label="廣告率評估" value={costHealth.adCostStatus} />
              <MetricCard label="回流率評估" value={costHealth.returningStatus} />
            </div>
          </Section>

          <Section title="第四區｜客戶經營能力">
            <div className="metric-grid four">
              <MetricCard label="新客率" value={formatPercent(customerHealth.newCustomerRate)} />
              <MetricCard label="介紹客比例" value={formatPercent(customerHealth.referralRate)} />
              <MetricCard label="客戶經營力" value={formatNumber(customerHealth.customerScore)} />
              <MetricCard label="客戶經營力評級" value={customerHealth.customerGrade} />
            </div>
          </Section>

          <Section title="第五區｜流量與內容能力">
            <div className="metric-grid four">
              <MetricCard label="社群經營度" value={formatNumber(digitalHealth.socialScore)} />
              <MetricCard label="內容執行力" value={formatNumber(digitalHealth.contentScore)} />
              <MetricCard label="數位成熟度" value={formatNumber(digitalHealth.digitalScore)} />
              <MetricCard label="數位成熟度評級" value={digitalHealth.digitalGrade} />
            </div>
          </Section>

          <Section title="轉換漏斗與廣告效率">
            <div className="metric-grid six">
              <MetricCard label="金流手續費率" value={formatPercent(funnelHealth.paymentFeeRate)} />
              <MetricCard label="CPA" value={funnelHealth.cpaLabel} />
              <MetricCard label="ROAS" value={funnelHealth.roasLabel} />
              <MetricCard label="預約率" value={formatPercent(funnelHealth.bookingRate)} />
              <MetricCard label="到店率" value={formatPercent(funnelHealth.visitRate)} />
              <MetricCard label="成交率" value={formatPercent(funnelHealth.dealRate)} />
            </div>
          </Section>

          <Section title="第九區｜總結診斷">
            <div className="narrative-grid">
              <div><h3>目前狀態</h3><p>{summary.currentStatus}</p></div>
              <div><h3>成長機會</h3><p>{summary.growthOpportunity}</p></div>
              <div><h3>建議方向</h3><p>{summary.direction}</p></div>
            </div>
          </Section>

          <Section title="第十區｜店家成長階段判定">
            <div className="metric-grid two">
              <MetricCard label="店家成長階段" value={growthStage.stage} />
              <MetricCard label="成長階段綜合分數" value={formatNumber(growthStage.score)} />
            </div>
            <p className="report-copy">{growthStage.description}</p>
          </Section>

          <Section title="第十一區｜獲利成長機會分析">
            <div className="metric-grid four">
              <MetricCard label="目前營收結構" value={`目前月營收 ${formatCurrency(growthOpportunity.revenue)}`} />
              <MetricCard label="回流提升空間" value={formatPercent(growthOpportunity.returningGap)} />
              <MetricCard label="可轉化營收" value={formatCurrency(growthOpportunity.convertibleRevenue)} />
              <MetricCard label="可提升獲利" value={formatCurrency(growthOpportunity.profitPotential)} />
            </div>
            <div className="metric-grid two">
              <MetricCard label="成長潛力評級" value={growthOpportunity.level} />
              <MetricCard label="顧問解讀" value={growthOpportunity.consultantComment} />
            </div>
          </Section>

          <Section title="第十二區｜下一步行動建議">
            <div className="cta-box">
              <p>{cta.nextStep}</p>
              <a className="btn" href={cta.bookingUrl || '#'} target="_blank" rel="noreferrer">{cta.bookingText || '預約 PFM 一對一診斷'}</a>
            </div>
          </Section>
        </>
      )}

      <div className="result-actions">
        <button className="btn secondary" onClick={onRestart}>重新健檢</button>
      </div>
    </main>
  );
}
