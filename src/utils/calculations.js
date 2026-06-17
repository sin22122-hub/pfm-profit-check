const n = (value) => Number(value || 0);
const sum = (data, keys) => keys.reduce((total, key) => total + n(data[key]), 0);
const rate = (num, den) => den ? num / den : 0;

const BUSINESS_TYPES = ['個人工作室', '小型店面', '多人店面', '多店/連鎖'];

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
}

function normalizeBusinessType(value) {
  const map = {
    '個人工作室': '個人工作室',
    '小型店面': '小型店面',
    '小型單店': '小型店面',
    '多人店面': '多人店面',
    '多店/連鎖': '多店/連鎖',
    '多店／連鎖': '多店/連鎖',
  };
  return map[value] || '小型店面';
}

function getBusinessType(data) {
  return normalizeBusinessType(data.businessType || data.branchCount);
}

function threshold(type, table, fallback) {
  return table[type] ?? fallback;
}

function statusLow(value, target) {
  return value < target ? '需改善' : '健康';
}

function marginStatus(value, type, lowTable, strongTable, fallbackLow, fallbackStrong) {
  const low = threshold(type, lowTable, fallbackLow);
  const strong = threshold(type, strongTable, fallbackStrong);
  if (value >= strong) return '優秀';
  if (value >= low) return '健康';
  return '需改善';
}

function costStatusHigh(value, target) {
  if (value <= target) return '健康';
  if (value <= target * 1.35) return '普通';
  return '偏高';
}

function returningStatus(value) {
  if (value >= 0.5) return '優秀';
  if (value >= 0.3) return '健康';
  if (value >= 0.2) return '普通';
  return '需改善';
}

function paymentFeeStatus(value) {
  if (value <= 0.01) return '優秀';
  if (value <= 0.02) return '健康';
  if (value <= 0.03) return '普通';
  if (value <= 0.04) return '偏高';
  return '危險';
}

function customerScore10(type, newRate, returningRate, referralRate) {
  const config = {
    '個人工作室': { rTarget: 0.6, nTarget: 0.2, fTarget: 0.15, rW: 60, nW: 25, fW: 15 },
    '小型店面': { rTarget: 0.5, nTarget: 0.25, fTarget: 0.15, rW: 50, nW: 35, fW: 15 },
    '多人店面': { rTarget: 0.4, nTarget: 0.25, fTarget: 0.25, rW: 40, nW: 35, fW: 25 },
    '多店/連鎖': { rTarget: 0.35, nTarget: 0.3, fTarget: 0.1, rW: 45, nW: 45, fW: 10 },
  }[type];

  const score =
    Math.min(returningRate / config.rTarget, 1) * config.rW +
    Math.min(newRate / config.nTarget, 1) * config.nW +
    Math.min(referralRate / config.fTarget, 1) * config.fW;

  return Math.round((score / 10) * 10) / 10;
}

function gradeCustomer(score) {
  if (score >= 8.5) return '優秀';
  if (score >= 7) return '穩定';
  if (score >= 5) return '普通';
  return '偏弱';
}

function socialScore(data) {
  const active = {
    '每天更新': 100,
    '每週穩定更新': 70,
    '每月更新': 35,
    '偶爾想到才更新': 15,
    '完全沒有': 0,
    '有固定經營': 70,
    '有經營但不穩定': 40,
    '偶爾發文': 20,
    '幾乎沒有經營': 10,
    '完全沒有經營': 0,
  }[data.socialActive] ?? 0;

  const posts = {
    '5篇以上': 80,
    '3~4篇': 60,
    '1~2篇': 35,
    '0篇': 0,
  }[data.weeklyPosts] ?? 0;

  return Math.round(active * 0.6 + posts * 0.4);
}

function contentScore(data) {
  const posts = {
    '5篇以上': 80,
    '3~4篇': 60,
    '1~2篇': 35,
    '0篇': 0,
  }[data.weeklyPosts] ?? 0;
  const video = {
    '每週都有': 100,
    '偶爾會拍': 50,
    '很少拍': 20,
    '完全沒有': 0,
  }[data.shortVideo] ?? 0;
  return Math.round(posts * 0.35 + video * 0.65);
}

function digitalGrade(score) {
  if (score >= 85) return '優秀';
  if (score >= 70) return '良好';
  if (score >= 40) return '待改善';
  return '偏弱';
}

function weights(type) {
  const matrix = {
    '個人工作室': { gross: 1, net: 1, returning: 1.5, customer: 1.5, hr: 0.5, rent: 0.8, ad: 0.8 },
    '小型店面': { gross: 1.2, net: 1.2, returning: 1.2, customer: 1.2, hr: 1, rent: 1, ad: 1 },
    '多人店面': { gross: 1.3, net: 1.5, returning: 1, customer: 1, hr: 1.3, rent: 1.2, ad: 1 },
    '多店/連鎖': { gross: 1.2, net: 2, returning: 0.8, customer: 0.8, hr: 2, rent: 1.5, ad: 1.2 },
  };
  return matrix[type] || matrix['小型店面'];
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
    '會員與回流系統待建立': '建立會員回購與回訪機制',
    '流量系統待建立': '建立穩定自然流量與內容節奏',
  };
  return map[problem] || '建立下一階段成長目標';
}

function consultantComment(problem, strength) {
  const map = {
    '客戶經營力不足': '目前新客來源與介紹客比例仍有優化空間，建議建立會員制度與顧客經營流程，提高回流與轉介紹能力。',
    '回流率偏低': '目前營收仍高度依賴新客開發，建議優先建立回流與會員制度，提高顧客終身價值。',
    '毛利率偏低': '目前服務毛利偏低，建議重新檢視定價策略、服務組合與耗材成本。',
    '淨利率偏低': '目前營收規模已具備基礎，但獲利未有效留存，建議優先檢視固定成本、營運支出與資源配置效率。',
    '租金壓力偏高': '目前租金成本占比較高，建議評估坪效、人員產能與客單價是否足以支撐現有店面成本。',
    '人事成本偏高': '目前人事支出比例偏高，建議檢視人員產值、排班效率與服務產能配置。',
    '廣告成本偏高': '目前廣告投入較高，建議重新檢視投放策略、CPA與ROAS。',
    '會員與回流系統待建立': '目前核心獲利結構雖無明顯風險，但會員、回購與回訪機制仍可加強，建議建立穩定的客戶經營流程。',
    '流量系統待建立': '目前核心獲利結構雖無明顯風險，但自然流量與內容節奏仍有優化空間，建議建立可持續的曝光與內容系統。',
  };
  if (problem === '目前無明顯問題') return `目前整體經營狀況穩定，建議持續放大「${strength}」，建立下一階段成長目標。`;
  return map[problem] || '目前整體經營狀況穩定，建議持續放大現有優勢。';
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
  const adServiceFee = adCost * 0.015;
  const adTotalCost = adCost + adServiceFee;
  const paymentFee = n(data.nonCashPayment) * 0.03;
  const operatingExpense = hrCost + storeCost + adTotalCost + paymentFee;
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
  const adRate = rate(adTotalCost, revenue);
  const paymentFeeRate = rate(paymentFee, revenue);
  const cpa = deals ? adTotalCost / deals : 0;
  const roas = adTotalCost ? revenue / adTotalCost : 0;
  const bookingRate = rate(bookings, adLeads);
  const visitRate = rate(visits, bookings);
  const dealRate = rate(deals, visits);

  const customerScore = customerScore10(businessType, newRate, returningRate, referralRate);
  const sScore = socialScore(data);
  const content = contentScore(data);
  const digital = Math.round(sScore * 0.45 + content * 0.55);
  const w = weights(businessType);

  const grossLowTarget = threshold(businessType, {'個人工作室':0.60,'小型店面':0.55,'多人店面':0.50,'多店/連鎖':0.45}, 0.55);
  const grossStrongTarget = threshold(businessType, {'個人工作室':0.75,'小型店面':0.70,'多人店面':0.65,'多店/連鎖':0.60}, 0.70);
  const netLowTarget = threshold(businessType, {'個人工作室':0.25,'小型店面':0.15,'多人店面':0.10,'多店/連鎖':0.08}, 0.10);
  const netStrongTarget = threshold(businessType, {'個人工作室':0.50,'小型店面':0.30,'多人店面':0.20,'多店/連鎖':0.15}, 0.20);
  const hrTarget = threshold(businessType, {'個人工作室':0.20,'小型店面':0.35,'多人店面':0.45,'多店/連鎖':0.50}, 0.45);
  const rentTarget = threshold(businessType, {'個人工作室':0.08,'小型店面':0.12,'多人店面':0.15,'多店/連鎖':0.18}, 0.12);
  const adTarget = threshold(businessType, {'個人工作室':0.10,'小型店面':0.15,'多人店面':0.18,'多店/連鎖':0.20}, 0.15);
  const returningTarget = threshold(businessType, {'個人工作室':0.40,'小型店面':0.35,'多人店面':0.30,'多店/連鎖':0.25}, 0.30);

  const problemScores = [
    { label: '客戶經營力不足', score: Math.max(0, (7 - customerScore) * 30) * w.customer },
    { label: '回流率偏低', score: Math.max(0, (returningTarget - returningRate) * 700) * w.returning },
    { label: '毛利率偏低', score: Math.max(0, (grossLowTarget - grossMargin) * 1000) * w.gross },
    { label: '淨利率偏低', score: Math.max(0, (netLowTarget - netMargin) * 1500) * w.net },
    { label: '廣告成本偏高', score: Math.max(0, (adRate - adTarget) * 1000) * w.ad },
    { label: '租金壓力偏高', score: Math.max(0, (rentRate - rentTarget) * 1000) * w.rent },
    { label: '人事成本偏高', score: Math.max(0, (hrRate - hrTarget) * 1000) * w.hr },
  ];

  const strengthScores = [
    { label: '毛利率表現優秀', score: Math.max(0, (grossMargin - grossStrongTarget) * 2000) * w.gross },
    { label: '淨利率表現優秀', score: Math.max(0, (netMargin - netStrongTarget) * 2000) * w.net },
    { label: '回流率表現優秀', score: Math.max(0, (returningRate - returningTarget) * 1000) * w.returning },
    { label: '高客單價優勢', score: averageTicket >= 8000 ? averageTicket / 1000 : 0 },
    { label: '介紹客來源穩定', score: referralRate >= 0.20 ? referralRate * 100 : 0 },
  ];

  let problems = topLabels(problemScores, '目前無明顯問題');
  const hasCoreProblem = problemScores.some((item) => item.score > 0);
  if (!hasCoreProblem) {
    const replacementProblems = [];
    if (customerScore < 7) replacementProblems.push('會員與回流系統待建立');
    if (digital < 70) replacementProblems.push('流量系統待建立');
    problems = [0, 1, 2].map((index) => replacementProblems[index] || '目前無明顯問題');
  }

  const strengths = topLabels(strengthScores, '目前無明顯優勢');
  const actions = problems.map((problem, index) => actionFor(problem, index));

  const currentStatus = problems[0] === '目前無明顯問題'
    ? '目前未發現明顯經營短板，整體獲利結構表現穩定，建議優先放大既有優勢。'
    : problems[1] === '目前無明顯問題'
      ? `目前主要卡點在「${problems[0]}」，其餘指標暫無明顯短板。`
      : `目前主要卡點在「${problems[0]}」，其次是「${problems[1]}」。`;

  const growthOpportunityText = strengths[0] === '目前無明顯優勢'
    ? '目前尚未形成明顯競爭優勢，建議先補強核心短板。'
    : `目前最大優勢是「${strengths[0]}」，可作為下一階段成長槓桿。`;

  const direction = problems[0] === '目前無明顯問題'
    ? `建議從「${actions[0]}」開始，並同步推進「${actions[1]}」。`
    : `建議優先從「${actions[0]}」開始，並同步觀察「${actions[1]}」。`;

  const stageScore = Math.round(
    (Math.min(grossMargin / grossStrongTarget, 1) * 25) +
    (Math.min(Math.max(netMargin, 0) / netStrongTarget, 1) * 25) +
    (Math.min(customerScore / 10, 1) * 35) +
    (Math.min(digital / 100, 1) * 15)
  );

  const stage = stageScore >= 85 ? '擴張期' : stageScore >= 65 ? '成長期' : stageScore >= 40 ? '穩定期' : '求生期';
  const growthLevel = customerScore >= 8.5 && returningRate >= 0.4 && digital >= 80 && netMargin >= 0 ? '極高' : customerScore >= 7 && returningRate >= 0.3 && digital >= 60 ? '高' : customerScore >= 5 && digital >= 40 ? '中' : '低';
  const returningGap = Math.max(0, 0.8 - returningRate);
  const convertibleRevenue = revenue * returningGap;
  const healthyNetMargin = netLowTarget;
  const profitPotential = convertibleRevenue * healthyNetMargin;

  return {
    basic: {
      storeName: data.storeName,
      storeType: asArray(data.storeType).join('、') || data.storeType || '-',
      businessType,
      month: data.month,
    },
    profitHealth: { revenue, grossMargin, netMargin, returningRate, averageTicket },
    costHealth: {
      grossMarginStatus: marginStatus(grossMargin, businessType, {'個人工作室':0.60,'小型店面':0.55,'多人店面':0.50,'多店/連鎖':0.45}, {'個人工作室':0.80,'小型店面':0.75,'多人店面':0.70,'多店/連鎖':0.65}, 0.55, 0.75),
      netMarginStatus: marginStatus(netMargin, businessType, {'個人工作室':0.25,'小型店面':0.15,'多人店面':0.10,'多店/連鎖':0.08}, {'個人工作室':0.50,'小型店面':0.30,'多人店面':0.20,'多店/連鎖':0.15}, 0.10, 0.20),
      hrCostStatus: costStatusHigh(hrRate, hrTarget),
      rentStatus: costStatusHigh(rentRate, rentTarget),
      adCostStatus: costStatusHigh(adRate, adTarget),
      paymentFeeStatus: paymentFeeStatus(paymentFeeRate),
      returningStatus: returningStatus(returningRate),
    },
    customerHealth: {
      newCustomerRate: newRate,
      referralRate,
      customerScore,
      customerGrade: gradeCustomer(customerScore),
    },
    digitalHealth: {
      socialScore: sScore,
      contentScore: content,
      digitalScore: digital,
      digitalGrade: digitalGrade(digital),
    },
    funnelHealth: {
      paymentFeeRate,
      cpaLabel: adTotalCost ? (deals ? formatSafe(cpa) : '未成交') : '未投放廣告',
      roasLabel: adTotalCost ? roas.toFixed(2) : '未投放廣告',
      bookingRate,
      visitRate,
      dealRate,
    },
    problems,
    strengths,
    actions,
    summary: { currentStatus, growthOpportunity: growthOpportunityText, direction },
    growthStage: {
      stage,
      score: stageScore,
      description: stage === '求生期'
        ? '目前最重要的是穩定客源與現金流。'
        : stage === '穩定期'
          ? '已具備基本營運基礎，建議建立會員與回流系統。'
          : stage === '成長期'
            ? '目前已具備成長條件，可開始建立流量與會員系統。'
            : '目前已具備擴張潛力，建議建立可複製的營運與管理系統。',
    },
    growthOpportunity: {
      revenue,
      returningGap,
      convertibleRevenue,
      profitPotential,
      level: growthLevel,
      consultantComment: consultantComment(problems[0], strengths[0]),
    },
    hiddenCost: {
      monthlyFee: paymentFee,
      paymentFeeRate,
      annualFee: paymentFee * 12,
      message: `本月金流手續費 ${formatSafe(paymentFee)} 元（${(paymentFeeRate * 100).toFixed(2)}%），若維持目前規模，一年約流失 ${formatSafe(paymentFee * 12)} 元的利潤，建議同步檢視金流結構與收款模式。`,
    },
    cta: {
      nextStep: problems[0] === '目前無明顯問題'
        ? '目前已具備穩定基礎，建議透過 PFM 診斷進一步放大既有優勢，建立下一階段成長目標。'
        : `建議優先針對「${problems[0]}」建立改善策略，並透過 PFM 診斷制定專屬獲利成長計畫。`,
      bookingText: '預約 PFM 一對一診斷',
      bookingUrl: '#',
    },
  };
}
