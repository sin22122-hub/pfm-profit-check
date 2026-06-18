const GOOGLE_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSdhzTKW4jMkBPbQ58tJ2UJHQP2XNjwfJyD5MowF6FCc-dZhhA/viewform?usp=preview';

const FIELD_MAP = {
  storeName: 'entry.1083752353',
  contactName: 'entry.330864519',
  phone: 'entry.1707906243',
  instagram: 'entry.527231499',
  storeType: 'entry.1449582445',
  businessType: 'entry.672256556',
  month: 'entry.1620963029',

  serviceRevenue: 'entry.1565655071',
  productRevenue: 'entry.2144465784',
  courseRevenue: 'entry.2131624406',
  otherRevenue: 'entry.1544107389',

  materialCost: 'entry.2030999767',
  productCost: 'entry.1150918617',
  techCommission: 'entry.997512654',
  assistantCommission: 'entry.1989153449',
  otherDirectCost: 'entry.1795654069',

  managerSalary: 'entry.710802695',
  staffSalary: 'entry.1053487491',
  laborInsurance: 'entry.27186313',
  bonus: 'entry.1110803399',
  otherHR: 'entry.361948318',

  rent: 'entry.1331278291',
  utilities: 'entry.1392612934',
  internetPhone: 'entry.143996885',
  posFee: 'entry.1947709599',
  cleaning: 'entry.473529161',
  misc: 'entry.209420695',

  metaAds: 'entry.1388228547',
  googleAds: 'entry.452803521',
  lineAds: 'entry.104503006',
  kol: 'entry.658077112',
  creative: 'entry.2089281697',
  otherAds: 'entry.1996606019',

  nonCashPayment: 'entry.1195904051',

  socialActive: 'entry.2392598',
  platforms: 'entry.24937666',
  weeklyPosts: 'entry.464291172',
  shortVideo: 'entry.1559783128',

  mainPain: 'entry.364503572',
  growthGoal: 'entry.784548526',
  learningPreference: 'entry.1326005160',

  totalCustomers: 'entry.1367995338',
  newCustomers: 'entry.906145170',
  returningCustomers: 'entry.589494914',
  referralCustomers: 'entry.1782207378',

  customerChannels: 'entry.1480554934',
  stableSource: 'entry.650352818',

  adLeads: 'entry.1405237024',
  bookings: 'entry.97661074',
  visits: 'entry.1363388595',
  deals: 'entry.759472950',
  adTracking: 'entry.1895985700',
};

function normalizeValue(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

export function buildGoogleFormPayload(data) {
  const entries = [];

  Object.entries(FIELD_MAP).forEach(([key, entryId]) => {
    const value = data[key];

    if (Array.isArray(value)) {
      value.forEach((item) => {
        const normalized = normalizeValue(item);
        if (normalized !== '') entries.push([entryId, normalized]);
      });
      return;
    }

    const normalized = normalizeValue(value);
    if (normalized !== '') entries.push([entryId, normalized]);
  });

  return entries;
}

export async function submitToGoogleForm(data) {
  const entries = buildGoogleFormPayload(data);

  if (!entries.length) {
    throw new Error('沒有可送出的表單資料');
  }

  const params = new URLSearchParams();

  entries.forEach(([entryId, value]) => {
    params.append(entryId, value);
  });

  const submitUrl = `${GOOGLE_FORM_ACTION}?${params.toString()}`;

  await fetch(submitUrl, {
    method: 'GET',
    mode: 'no-cors'
  });

  return true;
}
