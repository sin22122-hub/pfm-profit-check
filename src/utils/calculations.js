const n = (value) => Number(value || 0);
const sum = (data, keys) => keys.reduce((total, key) => total + n(data[key]), 0);
const rate = (num, den) => den ? num / den : 0;

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
}

function getBusinessType(data) {
  return data.businessType || data.branchCount || '小型單店';
}

function threshold(type, table, fallback) {
  return table[type] ?? fallback;
}

function statusLow(value, target) {
  return value < target ? '需改善' : '健康';
}

function statusHigh(value, target) {
  return value > target ? '偏高' : '健康';
}

function customerScore(newRate, returningRate, referralRate) {
  const returningScore = returningRate >= 0.5 ? 50 : returningRate >= 0.4 ? 40 : returningRate >= 0.3 ? 30 : returningRate >= 0.2 ? 20 : 10;
  const referralScore = referralRate >= 0.3 ? 30 : referralRate >= 0.2 ? 25 : referralRate >= 0.1 ? 15 : 5;
  const newScore = newRate >= 0.2 ? 20 : newRate >= 0.1 ? 15 : 10;
  return returningScore + referralScore + newScore;
}

function gradeCustomer(score) {
  if (score >= 80) return '優秀';
  if (score >= 60) return '穩定';
  if (score >= 40) return '普通';
  return '偏弱';
}

function socialScore(data) {
  const active = {'有固定經營':40,'有經營但不穩定':30,'偶爾發文':20,'幾乎沒有經營':10,'完全沒有經營':0}[data.socialActive] ?? 0;
  const platforms = Math.min(asArray(data.platforms).length * 10, 30);
  const posts = {'0篇':0,'1~2篇':15,'3~4篇':25,'5篇以上':30}[data.weeklyPosts] ?? 0;
  return Math.min(active + platforms + posts, 100);
}

function contentScore(data) {
  const posts = {'0篇':0,'1~2篇':30,'3~4篇':45,'5篇以上':55}[data.weeklyPosts] ?? 0;
  const video = {'每週都有':45,'偶爾會拍':30,'很少拍':15,'完全沒有':0}[data.shortVideo] ?? 0;
  return Math.min(posts + video, 100);
}

function digitalGrade(score) {
  if (score >= 85) return '優秀';
  if (score >= 70) return '良好';
  if (score >= 50) return '待改善';
  return '薄弱';
}

function weights(type) {
  const matrix = {
    '個人工作室': { gross: 1, net: 1, returning: 1.5, customer: 1.5, hr: 0.5, rent: 0.8, ad: 0.8 },
    '小型單店': { gross: 1.2, net: 1.2, returning: 1.2, customer: 1.2, hr: 1, rent: 1, ad: 1 },
    '多人店面': { gross: 1.3, net: 1.5, returning: 1, customer: 1, hr: 1.3, rent: 1.2, ad: 1 },
    '多店／連鎖': { gross: 1.2, net: 2, returning: 0.8, customer: 0.8, hr: 2, rent: 1.5, ad: 1.2 },
  };
  return matrix[type] || matrix['小型單店'];
}

function topLabels(items, emptyText) {
  const filtered = items.filter((item) => item.score > 0).sort((a, b) => b.score - a.score);
  return [0, 1, 2].map((i) => filtered[i]?.label || emptyText);
}

function actionFor(problem, index) {
  if (problem === '目前無明顯問題') return ['維持目前獲利結構', '放大目前優勢項目', '建立下一階段成長目標'][index] || '維持目前獲利結構';
  const map = {
    '客戶經營力不足': '建立會員回購機制',
    '回流率偏低': '建立回流機制',
    '毛利率偏低': '優化服務毛利結構',
    '淨利率偏低': '優化成本與利潤結構',
    '廣告成本偏高': '檢視廣告投放效益',
    '租金壓力偏高': '檢視固定成本壓力',
    '人事成本偏高': '優化人力配置',
  };
  return map[problem] || '建立下一階段成長目標';
}

function formatSafe(value) {
  return Math.round(value).toLocaleString('zh-TW');
}

export function calculateDiagnosis(data) {
  const businessType = getBusinessType(data);
  const revenue = sum(data, ['serviceRevenue','productRevenue','courseRevenue','otherRevenue']);
  const directCost = sum(data, ['materialCost','productCost','techCommission','assistantCommission','otherDirectCost']);
  const hrCost = sum(data, ['managerSalary','staffSalary','laborInsurance','bonus','otherHR']);
  const storeCost = sum(data, ['rent','utilities','internetPhone','posFee','cleaning','misc']);
  const adCost = sum(data, ['metaAds','googleAds','lineAds','kol','creative','otherAds']);
  const paymentFee = n(data.nonCashPayment) * 0.03;
  const operatingExpense = hrCost + storeCost + adCost + paymentFee;
  const grossProfit = revenue - directCost;
  const netProfit = grossProfit - operatingExpense;

  const totalCustomers = n(data.totalCustomers);
  const newCustomers = n(data.newCustomers);
  const returningCustomers = n(data.returningCustomers);
  const referralCustomers = n(data.referralCustomers);
  const adLeads = n(data.adLeads);
  const bookings = n(data.bookings);
  const visits = n(data.visits);
  const deals = n(data.deals);

  const grossMargin = rate(grossProfit, revenue);
  const netMargin = rate(netProfit, revenue);
  const averageTicket = rate(revenue, totalCustomers);
  const returningRate = rate(returningCustomers, totalCustomers);
  const newRate = rate(newCustomers, totalCustomers);
  const referralRate = rate(referralCustomers, totalCustomers);
  const hrRate = rate(hrCost, revenue);
  const rentRate = rate(n(data.rent), revenue);
  const adRate = rate(adCost, revenue);
  const paymentFeeRate = rate(paymentFee, revenue);
  const cpa = adLeads ? adCost / adLeads : 0;
  const roas = adCost ? revenue / adCost : 0;
  const bookingRate = rate(bookings, adLeads);
  const visitRate = rate(visits, bookings);
  const dealRate = rate(deals, visits);

  const cScore = customerScore(newRate, returningRate, referralRate);
  const sScore = socialScore(data);
  const content = contentScore(data);
  const digital = Math.round((sScore + content) / 2);
  const w = weights(businessType);

  const grossLowTarget = threshold(businessType, {'個人工作室':0.60,'小型單店':0.55,'多人店面':0.50,'多店／連鎖':0.45}, 0.55);
  const grossStrongTarget = threshold(businessType, {'個人工作室':0.75,'小型單店':0.70,'多人店面':0.65,'多店／連鎖':0.60}, 0.70);
  const netLowTarget = threshold(businessType, {'個人工作室':0.25,'小型單店':0.15,'多人店面':0.10,'多店／連鎖':0.08}, 0.10);
  const netStrongTarget = threshold(businessType, {'個人工作室':0.50,'小型單店':0.30,'多人店面':0.20,'多店／連鎖':0.15}, 0.20);
  const hrTarget = threshold(businessType, {'個人工作室':0.20,'小型單店':0.35,'多人店面':0.45,'多店／連鎖':0.50}, 0.45);
  const rentTarget = threshold(businessType, {'個人工作室':0.08,'小型單店':0.12,'多人店面':0.15,'多店／連鎖':0.18}, 0.12);
  const adTarget = threshold(businessType, {'個人工作室':0.15,'小型單店':0.12,'多人店面':0.10,'多店／連鎖':0.10}, 0.12);
  const returningTarget = threshold(businessType, {'個人工作室':0.40,'小型單店':0.35,'多人店面':0.30,'多店／連鎖':0.25}, 0.30);

  const problemScores = [
    { label: '客戶經營力不足', score: Math.max(0, (60 - cScore) * 3) * w.customer },
    { label: '回流率偏低', score: Math.max(0, (returningTarget - returningRate) * 700) * w.returning },
    { label: '毛利率偏低', score: Math.max(0, (grossLowTarget - grossMargin) * 1000) * w.gross },
    { label: '淨利率偏低', score: Math.max(0, (netLowTarget - netMargin) * 1000) * w.net },
    { label: '廣告成本偏高', score: Math.max(0, (adRate - adTarget) * 1000) * w.ad },
    { label: '租金壓力偏高', score: Math.max(0, (rentRate - rentTarget) * 1000) * w.rent },
    { label: '人事成本偏高', score: Math.max(0, (hrRate - hrTarget) * 1000) * w.hr },
  ];

  const strengthScores = [
    { label: '毛利率表現優秀', score: Math.max(0, (grossMargin - grossStrongTarget) * 2000) * w.gross },
    { label: '淨利率表現優秀', score: Math.max(0, (netMargin - netStrongTarget) * 2000) * w.net },
    { label: '回流率表現優秀', score: Math.max(0, (returningRate - returningTarget) * 1000) * w.returning },
    { label: '高客單價優勢', score: averageTicket >= 8000 ? averageTicket / 1000 : 0 },
    { label: '介紹客來源穩定', score: referralRate * 100 },
  ];

  const problems = topLabels(problemScores, '目前無明顯問題');
  const strengths = topLabels(strengthScores, '目前無明顯優勢');
  const actions = problems.map(actionFor);

  const currentStatus = problems[0] === '目前無明顯問題'
    ? '目前未發現明顯經營短板，整體獲利結構表現穩定，建議優先放大既有優勢。'
    : problems[1] === '目前無明顯問題'
      ? `目前主要卡點在「${problems[0]}」，其餘指標暫無明顯短板。`
      : `目前主要卡點在「${problems[0]}」，其次是「${problems[1]}」。`;

  const growthOpportunityText = strengths[0] === '目前無明顯優勢'
    ? '目前尚未出現明顯優勢項目，建議先補強核心短板。'
    : `目前最大優勢是「${strengths[0]}」，可作為下一階段成長槓桿。`;

  const direction = problems[0] === '目前無明顯問題'
    ? `建議從「${actions[0]}」開始，並同步推進「${actions[1]}」。`
    : `建議優先從「${actions[0]}」開始，並同步觀察「${actions[1]}」。`;

  const stageScore = Math.round(
    (Math.min(grossMargin / 0.7, 1) * 20) +
    (Math.min(Math.max(netMargin, 0) / 0.2, 1) * 20) +
    (Math.min(returningRate / 0.4, 1) * 20) +
    (Math.min(cScore / 100, 1) * 20) +
    (Math.min(digital / 100, 1) * 20)
  );

  const stage = stageScore >= 80 ? '擴張期' : stageScore >= 60 ? '成長期' : stageScore >= 45 ? '穩定期' : '求生期';
  const growthLevel = cScore >= 80 && returningRate >= 0.4 && sScore >= 80 ? '極高' : cScore >= 60 && returningRate >= 0.3 && sScore >= 60 ? '高' : cScore >= 40 && sScore >= 40 ? '中' : '低';
  const returningGap = Math.max(0, 0.8 - returningRate);
  const convertibleRevenue = revenue * returningGap;
  const profitPotential = convertibleRevenue * Math.max(netMargin, 0.08);

  return {
    basic: { storeName: data.storeName, storeType: asArray(data.storeType).join('、') || data.storeType || '-', businessType, month: data.month },
    profitHealth: { revenue, grossMargin, netMargin, returningRate, averageTicket },
    costHealth: { grossMarginStatus: statusLow(grossMargin, grossLowTarget), hrCostStatus: statusHigh(hrRate, hrTarget), rentStatus: statusHigh(rentRate, rentTarget), adCostStatus: statusHigh(adRate, adTarget), returningStatus: statusLow(returningRate, returningTarget) },
    customerHealth: { newCustomerRate: newRate, referralRate, customerScore: cScore, customerGrade: gradeCustomer(cScore) },
    digitalHealth: { socialScore: sScore, contentScore: content, digitalScore: digital, digitalGrade: digitalGrade(digital) },
    funnelHealth: { paymentFeeRate, cpaLabel: adLeads ? formatSafe(cpa) : '未投放廣告', roasLabel: adCost ? roas.toFixed(2) : '未投放廣告', bookingRate, visitRate, dealRate },
    problems, strengths, actions,
    summary: { currentStatus, growthOpportunity: growthOpportunityText, direction },
    growthStage: { stage, score: stageScore, description: stage === '求生期' ? '目前最重要的是穩定客源與現金流。' : stage === '穩定期' ? '已具備基本營運基礎，建議建立會員與回流系統。' : stage === '成長期' ? '目前已具備成長條件，可開始建立流量與會員系統。' : '目前已具備擴張潛力，建議建立可複製的營運與管理系統。' },
    growthOpportunity: { revenue, returningGap, convertibleRevenue, profitPotential, level: growthLevel, consultantComment: problems[0] === '目前無明顯問題' ? `目前已具備穩定獲利與成長基礎，建議優先放大「${strengths[0]}」。` : `目前建議優先針對「${problems[0]}」建立改善策略。` },
    cta: { nextStep: problems[0] === '目前無明顯問題' ? '目前已具備穩定基礎，建議透過 PFM 診斷進一步放大既有優勢，建立下一階段成長目標。' : '目前建議透過 PFM 診斷找出營收與獲利成長關鍵。', bookingText: '預約 PFM 一對一診斷', bookingUrl: '#' },
  };
}
